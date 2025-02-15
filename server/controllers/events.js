const eventsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Event = require('../models/event')
const User = require('../models/user')
const event = require('../models/event')

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

// Get events with an optional query
eventsRouter.get('/', async (request, response) => {
  const { createdBy } = request.query

  const filter = {}
  if (createdBy) {
    filter.createdBy = createdBy
  }

  const events = await Event.find(filter).populate('createdBy', { username: 1, name: 1 })
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

  // find user using userExtractor middlewear
  const user = request.user

  const event = new Event({
    title: body.title,
    description: body.description,
    dateTime: body.dateTime,
    location: body.location,
    numAttendees: body.numAttendees,
    createdBy: user._id
  })

  const savedEvent = await event.save()

  // update user object to show event created
  user.eventsCreated = user.eventsCreated.concat(savedEvent._id)
  await user.save()

  response.status(201).json(savedEvent)
})

// Remove event from DB (only by event creator)
eventsRouter.delete('/:id', async (request, response) => {
  const body = request.body

  // get event to delete
  const eventToDelete = await Event.findById(request.params.id)

  // find user using userExtractor middlewear
  const user = request.user

  // check if event belongs to user
  if (eventToDelete.createdBy.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Not authorised to delete this event' })
  }

  // delete event
  await Event.findByIdAndDelete(request.params.id)

  // remove event from user object
  user.eventsCreated = user.eventsCreated.filter(({ _id }) => eventToDelete._id.toString() !== _id.toString())
  await user.save()

  response.status(204).end()
})

// edit event (only by event creator)
eventsRouter.put('/:id', async (request, response) => {
  const body = request.body

  // get event to edit
  const eventToEdit = await Event.findById(request.params.id)

  // find user
  const user = request.user

  // check if event belongs to user
  if (eventToEdit.createdBy.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Not authorised to edit this event' })
  }

  // update event
  const updatedEvent = await Event.findByIdAndUpdate(eventToEdit.id, body, {
    new: true,
    runValidators: true,
  })

  if (!updatedEvent) {
    return response.status(404).json({error: "Event not found"})
  }

  response.json(updatedEvent).status(200).end()
})

// join event 
eventsRouter.patch('/:id', async (request, response) => {
  const { userId } = request.body; // User ID from request
  console.log("backend", userId)

  const event = await Event.findById(request.params.id);
  if (!event) {
    return response.status(404).json({ error: "Event not found" });
  }

  // Check if user is already in attendees list
  if (event.attendees.includes(userId)) {
    return response.status(400).json({ error: "User already joined this event" });
  }

  // Add user to attendees array
  event.attendees = event.attendees.concat(userId);
  await event.save();

  response.status(200).json({ message: "User joined event successfully", event });
})


module.exports = eventsRouter