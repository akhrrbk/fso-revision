// this is a new index file
// the old one been archived at ./archive/old_index_file
// old code was based on a local database.
// this file is connected to a mongoDB database using mongoose
// currently creating a note through frontend works but put/delete only works through a request via rest/postman
// importing dependencies

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/note')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const app = express()

morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('---')
    next()
}

app.use(requestLogger)

// gets all the notes
app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

// gets individual notes with an id
app.get('/api/notes/:id', (req, res) => {
    Note.findById(req.params.id)
        .then(note => {
            if(note){
                res.json(note)
            } else {
                res.status(404).end()
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

// deletes a note
app.delete('/api/notes/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// creating a new note
app.post('/api/notes', (req, res, next) => {
    const body = req.body

    if(body.content === undefined){
        return res.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        date: new Date(),
        important: false,
    })
    note.save()
        .then(savedNote => {
            res.json(savedNote)
        })
        .catch(error => next(error))
})

// updating a note with an id
app.put('/api/notes/:id', (req, res, next) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(error => next(error))
})

// middleware
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if(error.name === 'CastError'){
        return res.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError'){
        return res.status(400).send({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

// port configuration
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})