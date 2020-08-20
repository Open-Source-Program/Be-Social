import React, { useState, useEffect } from "react";
import Event from './Event.jsx';
import axios from 'axios';

export default function EventsFeed(props) {

  function handleDeleteEvent(evtID, index) {
    console.log(props)
    axios.delete(`/api/delete?eventid=${evtID}`);
    console.log('THIS IS THE OLD EVENTS ARRAY: ')
    console.log(props.events);
    const newState = props.events.splice(index, 1);
    console.log('THIS IS NEW EVENTS ARRAY: ')
    console.log(props.events);
    props.setEvents(newState);

    // const newEvents = [event].concat(events);
    // console.log("updated events:", newEvents);
    // setEvents(newEvents);
  }

  function handleUpdateEvent(eventObj, index) {
    console.log(props)
    axios.put(`/api/update`);
    console.log(props.events);
    const newState = props.events.splice(index, 1);
    console.log(props.events);
    props.setEvents(newState);

    // const newEvents = [event].concat(events);
    // console.log("updated events:", newEvents);
    // setEvents(newEvents);
  }
  
  console.log("Events Feed", props)
  let events = [];
  // useEffect(() => {
    // console.log('THIS IS USE EFFECT')
    if (props.events && Object.keys(props.events).length > 0) {
      events = props.events.map((event, index) => {
        return <Event
          {...event}
          handleDeleteEvent={handleDeleteEvent}
          handleCreateMessage={props.handleCreateMessage}
          userUpdate={props.userUpdate}
          key={`EventsFeed${index}`}
          index={index}
        />
      })
    }
  // },[])

  return (
    <div className="events">
      {events}
    </div>
  );
}