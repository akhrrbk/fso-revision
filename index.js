const express = require('express');
const { reset } = require('nodemon');
const cors = require('cors')

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

let notes = [
    {
        content: "jonizdan",
        date: "2022-01-28T04:42:10.427Z",
        important: false,
        id: 1
    },
    {
        content: "salom",
        date: "2022-01-28T04:42:13.011Z",
        important: false,
        id: 2
    },
    {
        content: "beriiiiing",
        date: "2022-01-28T04:42:16.356Z",
        important: false,
        id: 3
    },
    {
        content: "qales",
        date: "2022-01-28T04:43:29.599Z",
        important: false,
        id: 4
    }
]

const maxid = () => {
    return notes.length > 0 ? Math.max(...notes.map(n=>n.id)) : 0
}

app.get('/', (req, res) => {
    res.send(`home page madafako`)
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if(note){
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
})

app.post('/api/notes', (req, res) => {
    const body = req.body
    
    if(!body.content){
        return res.status(400).json({error: 'content missing'})
    }
    
    const newobject = {
        content: body.content,
        date: new Date(),
        important: false,
        id: maxid() + 1
    }
    // console.log(newobject);
    notes = notes.concat(newobject)
    res.json(newobject)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running at ${PORT}`);
})
