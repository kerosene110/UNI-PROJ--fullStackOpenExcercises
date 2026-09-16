const mongoose = require('mongoose')
require('dotenv').config({ path: './atlas-credentials.env' })

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URL, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)