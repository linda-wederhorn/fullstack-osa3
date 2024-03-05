const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.use(morgan(function (tokens, req, res) {
  let log = [tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms '].join(' ')

  return (tokens.method(req, res) !== 'POST') ? log : log.concat(JSON.stringify(req.body))
}))

app.get('/info', (_request, response, next) => {
  Person.find({}).then(result => {
    response.send('<p>Phonebook has info for ' + result.length + ' people</p>\n' +
            '<p>' + new Date() + '</p>')
  }).catch(error => next(error))
})

app.get('/api/persons', (_request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => { response.status(204).end() })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({
    name: name,
    number: number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

  app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    const person = new Person({
      name: name,
      number: number
    })

    Person.findByIdAndUpdate(request.params.id, person,
      { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
})

// unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.name, error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})