const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const Blog = require('./models/blog')
// const blogsRouter = require('./controllers/blogs')

const app = express()

mongoose.connect(config.MONGODB_URL, { family: 4 })
// mongoose
//   .connect(config.MONGODB_URL)
//   .then(() => {
//     console.info('connected to MongoDB')
//   })
//   .catch((error) => {
//     console.error('error connection to MongoDB:', error.message)
//   })

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = app