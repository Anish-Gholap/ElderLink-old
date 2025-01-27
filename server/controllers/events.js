const eventsRouter = require('express').Router()
const Event = require('../models/event')

// Get all events
eventsRouter.get('/', async (request, response) => {
  const events = await Event.find({})
  response.json(events)
})

// Get specific event
eventsRouter.get('/:id', async (request, response, next) => {
  try {
    const event = await Event.findById(request.params.id)
    if (event) {
      response.json(event)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// Add event to DB
eventsRouter.post('/', async (request, response) => {
  const body = request.body

  const event = new Event({
    title: body.title,
    description: body.description,
    dateTime: body.dateTime
  })

  const savedEvent = await event.save()
  response.status(201).json(savedEvent)
})

module.exports = eventsRouter