import React, { useRef, useState, useEffect } from "react";
import EventAttendees from './EventAttendees.jsx';
import Content from './Content.jsx';
import FileUpload from './Fileupload.jsx';
import DateTimePicker from 'react-datetime-picker';
import { ListGroup, Container, Row, Jumbotron, Modal, Button, Form, Card, Dropdown, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

export default function Event(props) {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [data, getFile] = useState({ name: "", path: "" });
  const [progress, setProgess] = useState(0);
  const el = useRef();

  const initialFormData = Object.freeze({
    eventtitle: props.eventtitle,
    eventlocation: props.eventlocation,
    eventdetails: props.eventdetails,
    eventtype: "calendar"
  });
  const [formData, updateFormData] = useState(initialFormData);
  const [dateTime, onChange] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
    windows.location.reload(true);
  };

  const handleSubmit = (e) => {
    console.log('THIS IS HANDLE SUBMIT: ', formData)
    e.preventDefault()
    const eventdate = dateTime.toDateString();
    let time = dateTime.toTimeString();
    let eventstarttime = time.split(" ")[0];
    // ... submit to API or something
    props.handleUpdateEvent({ ...formData, eventdate, eventstarttime, eventid: props.eventid });
    handleClose();
    console.log('state of show', show)
    windows.location.reload(true);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
              <h6>{props.eventdetails}</h6>
            </Container>
            {/* <Button id='update' variant="secondary" type="submit" onClick={() => { props.handleUpdateEvent(props.eventObj, props.index) }}> */}
            <Button id='update' variant="secondary" type="submit" onClick={handleShow}>
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

          <div className="eventBottom">
            <Content className="eventMessages" {...props} />
            <div className="mediaContainer">
              <FileUpload className="mediaUpload" />
            </div>
          </div>

          {/* Model Pop Up Box */}
          <Modal show={show} onHide={handleClose} animation={true}>
            <Modal.Header closeButton>
              <Modal.Title>Create Calendar Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formEventTitle">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control name='eventtitle' onChange={handleChange} required type="text" placeholder={props.eventtitle} />
                </Form.Group>

                <Form.Group controlId="formEventLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control name='eventlocation' onChange={handleChange} required type="text" placeholder={props.eventlocation} />
                </Form.Group>

                <Form.Group controlId="formEventDescription">
                  <Form.Label>Event Description</Form.Label>
                  <Form.Control name='eventdetails' onChange={handleChange} required as="textarea" placeholder={props.eventdetails} />
                </Form.Group>

                <Form.Group controlId="formStartDateTime">
                  <Form.Label>Start Date & Time</Form.Label>
                  <DateTimePicker
                    onChange={onChange}
                    value={dateTime}
                  />
                </Form.Group>

                <Form.Group controlId="formEventType">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Control name='eventtype' value="Calendar Event" />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={(e) => { handleSubmit(e) }}>
                  Submit
            </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </>
  );
}