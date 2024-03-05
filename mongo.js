require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

// const PORT = process.env.PORT
// const url = process.env.MONGODB_URI

const password = process.argv[2]
const url = `mongodb+srv://lindawederhorn:${password}@linda.bsgaanv.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 5) {
  const person = new Person({
    "name": process.argv[3],
    "number": process.argv[4]
  })
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  }).catch(err => console.warn("\n\nError in saving the note:\n", err))
}

if (process.argv.length == 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, " ", person.number)
    })
    mongoose.connection.close()
  })
}
