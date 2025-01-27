const Event = require('../models/event')

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


module.exports = {
  initialEvents, eventsInDb
}