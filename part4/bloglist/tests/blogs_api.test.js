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

after(async () => {
  await mongoose.connection.close()
})