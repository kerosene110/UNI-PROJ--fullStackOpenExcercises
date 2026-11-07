const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const userCreds = {
  username: 'test_case_user',
  password: 'test_case_pw'
}
const bearerToken = async () => {
  const response = await api
    .post('/api/login')
    .send(userCreds)

  return response.body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const testCaseUser = new User({
    username: userCreds.username,
    name: 'Test Case User',
    passwordHash: await bcrypt.hash(userCreds.password, 10)
  })
  const savedUser = await testCaseUser.save()
  helper.blogs.forEach((blog) => {
    blog.user = savedUser._id
  })
  await Blog.insertMany(helper.blogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.blogs.length)
})

test('the unique identifier property of the blog posts is named id rather than _id', async () => {
  const resp = await api.get('/api/blogs')
  resp.body.forEach((blog) => {
    assert.ok(blog.id)
  })
})

test('POST /api/blogs URL successfully creates a new blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const token = await bearerToken()

  const newBlog = {
    title: 'aa',
    author: 'bb',
    url: 'https://example.com',
    likes: 2000
  }
  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const titles = blogsAtEnd.map((blog) => blog.title)
  assert.ok(titles.includes(newBlog.title))
})

// Exercise 4.17: Expand blog list
test('when a new blog is created, the user from the bearer token is designated as its creator', async () => {
  const token = await bearerToken()

  const newBlog = {
    title: 'aa',
    author: 'bb',
    url: 'https://example.com',
    likes: 2000
  }
  const resp = await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const decodedToken = jwt.verify(token, process.env.PART4_SECRET)
  assert.strictEqual(decodedToken.id, resp.body.user)
})

test("when listing all blogs, the creator's user information is displayed with the blog", async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    assert.ok(blog.user)
  })
})

test('if the likes property is missing, it will default to the value 0.', async () => {
  const token = await bearerToken()

  const newBlog = {
    title: 'cc',
    author: 'dd',
    url: 'https://example.com',
  }
  const resp = await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(resp.body.likes, 0)
})

test('if the title or url properties are missing, the backend responds 400 Bad Request', async () => {
  const newBlog = { author: 'ok' }
  const token = await bearerToken()

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('Delete an existing blog post returns 204', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const someBlog = blogsAtStart[0]
  await api.delete(`/api/blogs/${someBlog.id}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtStart.length, blogsAtEnd.length + 1)
  const ids = blogsAtEnd.map((item) => item.id)
  assert(!ids.includes(someBlog.id))
})

test('Update an existing blog post returns 200', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const token = await bearerToken()
  const someBlog = blogsAtStart[0]
  const updatedBlog = { likes: 100 }

  const resp = await api.put(`/api/blogs/${someBlog.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(resp.body.likes, updatedBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})