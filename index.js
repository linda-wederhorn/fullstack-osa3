const express = require('express')
const app = express()
let phonebook = require('./phonebook')
app.use(express.json())

console.log(phonebook)

app.get('/info', (_request, response) => {
  response.send('<p>Phonebook has info for ' + phonebook.length + ' people</p>' + new Date())
})

app.get('/api/persons', (_request, response) => {
  response.json(phonebook)
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
  console.log("DELETE!!!")
  const id = Number(request.params.id)
  if (!phonebook.find(person => person.id === id)) response.status(404).end()
  phonebook = phonebook.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})