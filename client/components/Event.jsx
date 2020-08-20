import React, { useState, useEffect } from "react";
import EventAttendees from './EventAttendees.jsx';
import Content from './Content.jsx';
import { ListGroup, Container, Row, Jumbotron, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

export default function Event(props) {
  console.log('==========> Event from Event.jsx: ', props);


  return (
    <>
      <b className="hr anim"></b>
      <div className="event">
        <Container>
          <Jumbotron fluid>
            <Container className='eventJumbotron'>
              <h1>{props.eventtitle}</h1>
              <h3>{props.eventdate} - {props.starttime}</h3>
              <h5>{props.eventlocation}</h5>
              <p>{props.eventdetails}</p>
            </Container>
            <Button id='update' variant="secondary" type="submit" onClick={() => { props.handleUpdateEvent(props.eventObj, props.index) }}>
              Update
            </Button>
            <Button id='delete' variant="secondary" type="submit" onClick={() => { props.handleDeleteEvent(props.eventid, props.index) }}>
              Delete
            </Button>
          </Jumbotron>

          <div className="attendees">
            <EventAttendees className="attendeelist"
              {...props}
              userUpdate={props.userUpdate}
            />
          </div>
          <Content {...props} />
        </Container>
      </div>
    </>
  );
}