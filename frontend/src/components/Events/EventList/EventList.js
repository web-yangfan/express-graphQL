import React from 'react';
import EventItem from './EventItem/EventItem';

const eventList = props => {
  const events = props.events.map(event => {
    return (
      <EventItem 
        key={event._id}
        eventId = {event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        creatorId={event.creator._id}
        userId = {props.authUserId}
        onDetail={props.onViewDetail}
      />
    )
  });
  
  return (
    <ul className="event__list">{events}</ul>
  )
}
  


export default eventList;