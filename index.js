require('dotenv').config()
const express = require('express');
const cors = require('cors')
const Note = require('./models/note')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next()
}

app.use(requestLogger)

// // old way - now our application is using mongoose instead of this object below
// let notes = [
//     {
//         content: "jonizdan",
//         date: "2022-01-28T04:42:10.427Z",
//         important: false,
//         id: 1
//     },
//     {
//         content: "salom",
//         date: "2022-01-28T04:42:13.011Z",
//         important: false,
//         id: 2
//     },
//     {
//         content: "beriiiiing",
//         date: "2022-01-28T04:42:16.356Z",
//         important: false,
//         id: 3
//     },
//     {
//         content: "qales",
//         date: "2022-01-28T04:43:29.599Z",
//         important: false,
//         id: 4
//     }
// ]

// const generateid = () => {
//     const maxid = notes.length > 0 ? Math.max(...notes.map(n=>n.id)) : 0
//     return maxid + 1
// }

app.get('/', (req, res) => {
    res.send(`home page madafako`)
})

// // old way of retreiving data in the backend
// app.get('/api/notes', (req, res) => {
//     res.json(notes)
// })

// new way - mongoose
app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (req, res) => {
    Note.findById(req.params.id).then(note => {
        res.json(note)
        mongoose.connection.close()
    })
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

app.post('/api/notes', (req, res) => {
    const body = req.body
    
    if(body.content === undefined){
        return res.status(400).json({error: 'content missing'})
    }
    
    const note = new Note({
        content: body.content,
        date: new Date(),
        important: false,
    })
    note.save().then(savedNote => {
        res.json(savedNote)
    })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})
