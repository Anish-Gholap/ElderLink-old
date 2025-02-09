import { useEventsContext } from "../contexts/EventsContext"
import EventCard from "../components/EventCard"

const ManageEvents = () => {
  const {myEvents, removeEvent} = useEventsContext()
  console.log("myevents:", myEvents)

  const handleDelete = (id) => {
    removeEvent(id).catch(err => console.error(err))
  } 

  return (
    <div>
      <h2> Created By You </h2>
      {myEvents.map(event => {
        return (
          <div key={event._id} style={{ marginBottom: "1rem" }}>
            <EventCard event={event} key={event.id} />
            <button onClick={() => handleDelete(event.id)}>Delete</button>
          </div>
        )
      })}
    </div>
  )
}

export default ManageEvents