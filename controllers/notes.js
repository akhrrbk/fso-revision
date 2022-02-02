const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

// gets all the notes
notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({}).populate('user', {username: 1, name: 1})
    res.json(notes)
})

// gets individual notes with an id
notesRouter.get('/:id', async (req, res) => {
    const note = await Note.findById(req.params.id)
    if(note){
        res.json(note)
    } else {
        res.status(404).end()
    }
})

// deletes a note
notesRouter.delete('/:id', async (req, res, next) => {
    const result = await Note.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

// creating a new note
notesRouter.post('/', async (req, res, next) => {
    const body = req.body

    if(body.content === undefined || body.userid === undefined){
        return res.status(400).json({ error: 'content missing' })
    }
    const user = await User.findById(body.userid)

    const note = new Note({
        content: body.content,
        date: new Date(),
        important: false,
        user: body.userid
    })
    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    res.json(savedNote)
})

// updating a note with an id
notesRouter.put('/:id', async (req, res, next) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, { new: true })
    res.json(updatedNote)
})

module.exports = notesRouter