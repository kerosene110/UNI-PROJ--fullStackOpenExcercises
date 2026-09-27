const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
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
  const newBlog = {
    title: 'aa',
    author: 'bb',
    url: 'https://example.com',
    likes: 2000
  }
  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const titles = blogsAtEnd.map((blog) => blog.title)
  assert.ok(titles.includes(newBlog.title))
})

test('if the likes property is missing, it will default to the value 0.', async () => {
  const newBlog = {
    title: 'cc',
    author: 'dd',
    url: 'https://example.com',
  }
  const resp = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(resp.body.likes, 0)
})

test('if the title or url properties are missing, the backend responds 400 Bad Request', async () => {
  const newBlog = { author: 'ok' }
  await api.post('/api/blogs').send(newBlog).expect(400)
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

after(async () => {
  await mongoose.connection.close()
})