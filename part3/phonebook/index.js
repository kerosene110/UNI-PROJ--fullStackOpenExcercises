const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

morgan.token('post_data', function (req, _) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_data'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(results => {
      response.json(results)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(results => {
      response.send(
        `<p>Phonebook has info for ${results.length} people</p>
        <p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  Person.find({ name: body.name })
    .then(result => {
      if (result.length > 0) {
        return response.status(409).json({ error: 'name must be unique' })
      }

    const entry = new Person({
      name: body.name,
      number: body.number
    })
    entry.save().then(response.json(entry))
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  Person.findById(request.params.id)
    .then(p => {
      if (!p) {
        return response.status(404).end()
      }

      p.name = body.name
      p.number = body.number

      return p.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})