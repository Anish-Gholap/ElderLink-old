const Event = require('../models/event')
const User = require('../models/user')

const initialEvents = [
  {
    title: "Team Meeting",
    description: "Weekly team sync-up to discuss project updates and blockers.",
    dateTime: '2025-02-01T10:00:00Z'
  },
  {
    title: "Webinar on Backend Development",
    description: "An online session covering Node.js and Express best practices.",
    dateTime: '2025-02-03T15:00:00Z'
  }
]

const eventsInDb = async () => {
  const events = await Event.find({})
  return events.map(event => event.toJSON() )
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialEvents, eventsInDb, usersInDb
}