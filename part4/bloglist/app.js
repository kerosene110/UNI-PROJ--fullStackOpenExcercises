const express = require('express')
require('dotenv').config({path: './atlas-credentials.env', override: true })
const mongoose = require('mongoose')

const app = express()
const Blog = require('./models/blog')

const mongoUrl = process.env.MONGODB_URL
// console.log(`connecting to ${mongoUrl}`)
mongoose.connect(mongoUrl, { family: 4 })

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