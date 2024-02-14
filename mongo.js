require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

const PORT = process.env.PORT
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
}).catch(err => console.warn("\n\nError in saving the note:\n", err))