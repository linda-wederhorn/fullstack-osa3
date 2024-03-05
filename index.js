const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
let phonebook = require('./phonebook')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.use(morgan(function (tokens, req, res) {
  let log = [tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'), '-',
  tokens['response-time'](req, res), 'ms '].join(' ')

  return (tokens.method(req, res) != "POST") ? log : log.concat(JSON.stringify(req.body))
}))

app.get('/info', (_request, response) => {
  response.send('<p>Phonebook has info for ' + phonebook.length + ' people</p>' + new Date())
})

app.get('/api/persons', (_request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phonebook.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  if (!phonebook.find(person => person.id === id)) response.status(404).end()
  phonebook = phonebook.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number)
    return response.status(400).json({
      error: 'name and/or number missing'
    })

  if (phonebook.find(person => person.name === body.name))
    return response.status(400).json({
      error: 'name already in phonebook'
    })

  if (phonebook.find(person => person.number === body.number))
    return response.status(400).json({
      error: 'number already in phonebook'
    })

  const person = {
    id: Math.floor(Math.random() * 10000000),
    name: body.name,
    number: body.number,
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})