const express = require('express')
const app = express()
const phonebook = require('./phonebook')
app.use(express.json())

console.log(phonebook)

app.get('/api/persons', (_request, response) => {
  response.json(phonebook)
})

app.get('/info', (_request, response) => {
  response.send('<p>Phonebook has info for ' + phonebook.length + ' people</p>' + new Date())
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})