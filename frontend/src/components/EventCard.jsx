import "../css/eventcard.css"

const EventCard = ({event}) => {
  return (
    <div className="event-card">
      <h3 className="event-title">{event.title}</h3>
      <p className="event-datetime">{event.dateTime}</p>
    </div>
  )
}

export default EventCard