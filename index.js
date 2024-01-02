const express = require('express')
const app = express()
const phonebook = require('./phonebook')
app.use(express.json())

console.log(phonebook)

app.get('/api/persons', (_request, response) => {
  response.json(phonebook)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})