const mongoose = require('mongoose')
const config = require('../utils/config')
require('dotenv').config()

const url = config.MONGODB_URI

console.log(`MODEL NOTE: connecting to ${url}`)
mongoose.connect(url)
    .then(res => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: {  type: String, minlength: 5, required: true },
    date: { type: Date, required: true },
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)