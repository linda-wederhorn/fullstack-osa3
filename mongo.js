require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 4) {
  const person = new Person({
    'name': process.argv[3],
    'number': process.argv[4]
  })
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  }).catch(err => console.warn('\n\nError in saving the note:\n', err))
}

if (process.argv.length === 2) {
  Person.find({}).then(result => {
    result.forEach((person) => {
      console.log(person.name, ' ', person.number)
    })
    mongoose.connection.close()
  })
}
