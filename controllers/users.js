const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({}).populate('blogs')
        response.json(users)
    } catch (error) {
        response.status(400).send
    }
})

usersRouter.delete('/', async (request, response) => {
    await User.deleteMany({})
    return response.status(200).end()
})


usersRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.password.length < 3)
        return response.status(400).json({ error: 'password must be at least 3 characters' })

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        blogs: []
    })

    try {
        const savedUser = await user.save()
        response.json(savedUser)
    } catch (e) {
        response.status(400).send(e.message)
    }


})

module.exports = usersRouter