const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findOne({username: body.username})
    const passwordcorrect = user === null ? false : bcrypt.compare(body.password, user.passwordHash)

    if(!(user && passwordcorrect)){
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userfortoken = {
        username: user.username,
        id: user._id
    }

    const token = jsonwebtoken.sign(userfortoken, process.env.SECRET, {expiresIn: 60*60})
    res.status(200).send({token, username: user.username, name: user.name})
})

module.exports = loginRouter