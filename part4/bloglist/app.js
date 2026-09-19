const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

const app = express()

mongoose.connect(config.MONGODB_URL, { family: 4 })

app.use(express.json())
console.log(blogsRouter)
app.use('/api/blogs', blogsRouter)
module.exports = app