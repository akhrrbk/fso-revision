const { application } = require('express')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
    await Note.deleteMany({})

    const noteobject = helper.initiatenotes.map(note => new Note(note))
    const promisedarray = noteobject.map(note => note.save())
    await Promise.all(promisedarray)
})

test('notes are returned as json', async () => {
    console.log('entered test')
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('there are 2 notes', async () => {
    const res = await api.get('/api/notes')
    expect(res.body).toHaveLength(2)
}, 100000)

// test('content is - salom yaxshi qiz', async () => {
//     const res = await api.get('/api/notes')
//     expect(res.body[0].content).toBe('salom yaxshi qiz')
// }, 100000)

describe('working with test database', () => {
    test('testing with beforeEach - there should be two notes in the database now', async () => {
        const res = await api.get('/api/notes')
        expect(res.body).toHaveLength(helper.initiatenotes.length)
    })

    test('the content should be - Browser can execute only Javascript', async () => {
        const res = await api.get('/api/notes')
        expect(res.body[1].content).toEqual('Browser can execute only Javascript')
    })

    test('a valid note can be added', async () => {
        const newnote = {
            // content: 'Axror is adding a new note',
            important: false
        }

        // await api.post('/api/notes').send(newnote).expect(200).expect('Content-Type', /application\/json/)
        await api.post('/api/notes').send(newnote).expect(400)

        const res = await api.get('/api/notes')
        // const contents = res.body.map(per => per.content)

        expect(res.body).toHaveLength(helper.initiatenotes.length)
        // expect(contents).toContain('Axror is adding a new note')
    })
})

describe('test for fetching and removing an individual note', () => {
    test('getting a note with an id', async () => {
        const notesatstart = await helper.notesindb()
        const notetoview = notesatstart[0]

        const resultnote = await api.get(`/api/notes/${notetoview.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processednotetoview = JSON.parse(JSON.stringify(notetoview))
        expect(resultnote.body).toEqual(processednotetoview)
    })

    test('deleting a note with an id', async () => {
        const notesatstart = await helper.notesindb()
        const notetodelete = notesatstart[0]

        await api.delete(`/api/notes/${notetodelete.id}`).expect(204)

        const notesatend = await helper.notesindb()

        expect(notesatend).toHaveLength(helper.initiatenotes.length -1)
        const contents = notesatend.map(per => per.content)
        expect(contents).not.toContain(notetodelete.content)
    })
})

afterAll(() => {
    mongoose.connection.close()
})