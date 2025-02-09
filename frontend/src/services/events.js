import axios from 'axios'
const baseUrl = "/api/events"

const getAllEvents = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getUserEvents = async (userId) => {
  const response = await axios.get(`${baseUrl}?createdBy=${userId}`)
  return response.data
}

const createEvent = async (eventData) => {
  const response = await axios.post(baseUrl, eventData)
  return response.data
}

const deleteEvent = async (eventId) => {
  console.log(eventId)
  const response = await axios.delete(`${baseUrl}/${eventId}`)
  return response.data
}

export default {
  getAllEvents,
  getUserEvents,
  createEvent,
  deleteEvent
}