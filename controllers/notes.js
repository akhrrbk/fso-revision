const notesRouter = require('express').Router()
const Note = require('../models/note')

// gets all the notes
notesRouter.get('/', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

// gets individual notes with an id
notesRouter.get('/:id', (req, res) => {
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
notesRouter.delete('/:id', (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// creating a new note
notesRouter.post('/', (req, res, next) => {
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
notesRouter.put('/api/notes/:id', (req, res, next) => {
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

module.exports = notesRouter