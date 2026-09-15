const mongoose = require('mongoose')
require('dotenv').config({ path: './atlas-credentials.env' })

const url = process.env.MONGODB_URL
mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
  console.log('phonebook:')
  Person.find({}).then(results => {
    results.forEach(p => {
      console.log(p)
    })
    mongoose.connection.close()
  })

} else if (process.argv.length == 5) {
  const p = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  p.save().then(_ => {
    console.log('person saved!')
    mongoose.connection.close()
  })

}
