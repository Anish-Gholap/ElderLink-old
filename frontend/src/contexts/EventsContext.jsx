/* eslint-disable react-refresh/only-export-components */
// Context to manage events across all 
import { createContext, useState, useEffect, useContext } from "react";
import eventsService from "../services/events"
import { useAuthContext } from "../contexts/AuthContext"

const EventsContext = createContext()

export const useEventsContext = () => useContext(EventsContext)

export const EventsProvider = ({ children }) => {
  const { user } = useAuthContext()

  const [allEvents, setAllEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])

  // 1) Fetch all events for events discovery
  useEffect(() => {
    eventsService.getAllEvents()
      .then(data => setAllEvents(data))
      .catch(err => console.error("Error fetching all events: ", err))
  }, [])

  // 2) Fetch user-specific events for manage events
  useEffect(() => {
    if (user && user.id) {
      eventsService.getUserEvents(user.id)
        .then(data => setMyEvents(data))
        .catch(err => console.error("Error fetching user events:", err));
    } else {
      // If user logs out or no user, clear
      console.log("No user found, skipping fetch.")
      setMyEvents([]);
    }
  }, [user])

  // helper functions to refetch and update local state to keep everything in sync
  const addEvent = async (eventData) => {
    const response = await eventsService.createEvent(eventData)
    console.log(response)
    
    const refreshedAll = await eventsService.getAllEvents()
    setAllEvents(refreshedAll)

    // If user is creator, refetch their events
    if (user?.id) {
      const refreshedMine = await eventsService.getUserEvents(user.id)
      setMyEvents(refreshedMine)
    }
  }

  const removeEvent = async (eventId) => {
    await eventsService.deleteEvent(eventId)

    const refreshedAll = await eventsService.getAllEvents();
    setAllEvents(refreshedAll);

    if (user?.id) {
      const refreshedMine = await eventsService.getUserEvents(user.id);
      setMyEvents(refreshedMine);
    }
  }

  const value = {
    allEvents,
    myEvents,
    addEvent,
    removeEvent
  }

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  )
} 
