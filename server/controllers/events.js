const eventsRouter = require('express').Router()
const Event = require('../models/event')
const User = require('../models/user')

/* Errors are automatically caught and sent to the error handler */

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