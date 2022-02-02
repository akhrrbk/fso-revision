const infoRouter = require('express').Router()
const Note = require('../models/note')

infoRouter.get('/info', async (req, res) => {
    const notes = await Note.find({})
    const content = `Database has ${notes.length} notes`
    res.json(content)
})

module.exports = infoRouter