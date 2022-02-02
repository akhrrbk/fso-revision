const Note = require('../models/note')

const initiatenotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true
    }
]

const nonexistingid = async () => {
    const note = new Note({
        content: 'will be removing this soon',
        date: new Date()
    })
    await note.save()
    await note.remove()
    return note._id.toString()
}

const notesindb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    initiatenotes,
    nonexistingid,
    notesindb
}