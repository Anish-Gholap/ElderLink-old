const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

// add user to Db
usersRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

// get all users from Db
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('eventsCreated', {title: 1, dateTime: 1, attendees: 1})
  response.json(users)
})

module.exports = usersRouter