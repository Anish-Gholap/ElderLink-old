import EventCard from "../components/EventCard"
import {useEventsContext} from "../contexts/EventsContext"

const EventDiscovery = () => {
  const {allEvents} = useEventsContext()

  return (
    <>
      {allEvents.map(event => 
        <EventCard event={event} key={event.id} />
      )}
    </>
  )
}

export default EventDiscovery