const assert = require('node:assert')
const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const test_case_user = new User({
    username: `test_case_user`,
    name: 'Test Case User',
    passwordHash: await bcrypt.hash('test_case_pw', 10)
  })
  const savedUser = await test_case_user.save()
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
  const usersAtStart = await helper.usersInDb()
  const newBlog = {
    title: 'aa',
    author: 'bb',
    url: 'https://example.com',
    likes: 2000,
    userId: usersAtStart[0].id
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

// Exercise 4.17: Expand blog list
test('when a new blog is created, a user from the database is designated as its creator', async () => {
  const usersInDB = await helper.usersInDb()
  const firstUserInDB = usersInDB[0]

  const newBlog = {
    title: 'aa',
    author: 'bb',
    url: 'https://example.com',
    likes: 2000,
    userId: firstUserInDB.id
  }
  const resp = await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(firstUserInDB.id, resp.body.user)
})

test("when listing all blogs, the creator's user information is displayed with the blog", async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    assert.ok(blog.user)
  })
})

test('if the likes property is missing, it will default to the value 0.', async () => {
  const usersInDB = await helper.usersInDb()
  const firstUserInDB = usersInDB[0]

  const newBlog = {
    title: 'cc',
    author: 'dd',
    url: 'https://example.com',
    userId: firstUserInDB.id
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

test('Update an existing blog post returns 200', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const someBlog = blogsAtStart[0]
  const updatedBlog = { likes: 100 }

  const resp = await api.put(`/api/blogs/${someBlog.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(resp.body.likes, updatedBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})