const eventsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Event = require('../models/event')
const User = require('../models/user')

/* Errors are automatically caught and sent to the error handler */

// get token from HTTP request for authorization of request i.e only logged in users will be able to create events
const getTokenFrom = request => {
  // get the authorization header and remove it from the identifier scheme
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// Get all events
eventsRouter.get('/', async (request, response) => {
  const events = await Event.find({}).populate('createdBy', {username: 1, name: 1})
  response.json(events)
})

// Get specific event
eventsRouter.get('/:id', async (request, response, next) => {
  const event = await Event.findById(request.params.id)
    if (event) {
      response.json(event)
    } else {
      response.status(404).end()
    }
})

// Add event to DB
eventsRouter.post('/', async (request, response) => {
  const body = request.body

  // decode token to verify
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({error: 'token invalid'})
  }

  // add user who created event
  const user = await User.findById(body.userId)

  const event = new Event({
    title: body.title,
    description: body.description,
    dateTime: body.dateTime,
    createdBy: user.id
  })

  const savedEvent = await event.save()
  
  // update user object to show event created
  user.eventsCreated = user.eventsCreated.concat(savedEvent._id)
  await user.save()
  response.status(201).json(savedEvent)
})

module.exports = eventsRouter