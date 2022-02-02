const bcrypt = require('bcrypt')
const { application } = require('express')
const User = require('../models/user')
const helper = require('./test_helper_users')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('when there is initiially on user in DB', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('mycode', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('adding new users to the database', async () => {
        const usersatstart = await helper.usersindb()
        const newuser = {
            username: 'akhrrbk',
            name: 'Axror',
            password: 'hellomother'
        }

        await api.post('/api/users')
            .send(newuser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersatend = await helper.usersindb()
        expect(usersatstart.length).toBe(usersatend.length - 1)

        const usernamescontext = usersatend.map(per => per.username)
        expect(usernamescontext).toContain(newuser.username)
    }, 100000)

    test('username should be unique', async () => {
        const usersatstart = await helper.usersindb()
        const newuser = {
            username: 'root',
            name: 'Axror',
            password: 'rootpassword'
        }

        const result = await api.post('/api/users')
            .send(newuser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersatend = await helper.usersindb()
        expect(usersatstart.length).toBe(usersatend.length)
    })
})