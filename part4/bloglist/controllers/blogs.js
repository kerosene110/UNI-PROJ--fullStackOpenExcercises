const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (_, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(request.user)
  if (!user) {
    return response.status(400).json({ error: 'User missing or not valid' })
  }

  const blog = new Blog({
    user: user._id,
    ...request.body
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const reqUserId = request.user
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== reqUserId.toString()) {
    return response.status(401).json({ error: 'Unauthorized deletion' })
  } 
  
  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const blogToUpdate = await Blog.findById(request.params.id)
  if (!blogToUpdate) {
    return response.status(404).end()
  }

  blogToUpdate.likes = likes
  const result = await blogToUpdate.save()
  response.json(result)
})

module.exports = blogsRouter