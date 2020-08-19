import React, { useState, useEffect } from "react";

import DateTimePicker from 'react-datetime-picker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, Card, Dropdown, ButtonGroup } from 'react-bootstrap';

export default function CreateEvent({ addEvent }) {
  /* Form data */
  const initialFormData = Object.freeze({
    eventtitle: "",
    eventlocation: "",
    eventdetails: "",
  });

  const initialFormData2 = Object.freeze({
    cookingtitle: "",
    ingredients: "",
    eventdetails: "",
  });

  const [formData, updateFormData] = React.useState(initialFormData);
  const [formData2, updateFormData2] = React.useState(initialFormData2);
  const [dateTime, onChange] = useState(new Date());
  const [dateTime2, onChange2] = useState(new Date());
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleChange = (e) => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleChange2 = (e) => {
    updateFormData2({
      ...formData2,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const eventdate = dateTime.toDateString();
    let time = dateTime.toTimeString();
    let eventstarttime = time.split(" ")[0];
    // ... submit to API or something
    addEvent({ ...formData, eventdate, eventstarttime });
    handleClose();
  };

  const handleSubmit2 = (e) => {
    e.preventDefault()
    const eventdate2 = dateTime2.toDateString();
    let time2 = dateTime2.toTimeString();
    let eventstarttime2 = time2.split(" ")[0];
    // ... submit to API or something
    addEvent({ ...formData2, eventdate2, eventstarttime2 });
    handleClose2();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  // const handleDate = date => {
  //   setDate(date);
  // };

  return (
    <div>
      <div className='cardContainer'>
        <Dropdown as={ButtonGroup}>
          <Button variant="success">Select Event Type</Button>

          <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleShow2}>Cook Off</Dropdown.Item>
            <Dropdown.Item onClick={handleShow}>Calendar Event</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Modal show={show2} onHide={handleClose2} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Create Cooking Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formECookingventTitle">
              <Form.Label>Cooking Event Title</Form.Label>
              <Form.Control name='cookingtitle' onChange={handleChange2} required type="text" placeholder="Enter title" />
            </Form.Group>

            <Form.Group controlId="formIngredients">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control name='ingredients' onChange={handleChange2} required type="text" placeholder="Enter ingredient here" />
            </Form.Group>

            <Form.Group controlId="formEventDescription">
              <Form.Label>Event Description</Form.Label>
              <Form.Control name='eventdetails' onChange={handleChange2} required as="textarea" placeholder="Enter description" />
            </Form.Group>

            <Form.Group controlId="formStartDateTime">
              <Form.Label>Start Date & Time</Form.Label>
              <DateTimePicker
                onChange={onChange2}
                value={dateTime2}
              />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={(e) => { handleSubmit2(e) }}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>Create Calendar Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Event Title</Form.Label>
              <Form.Control name='eventtitle' onChange={handleChange} required type="text" placeholder="Enter title" />
            </Form.Group>

            <Form.Group controlId="formEventLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control name='eventlocation' onChange={handleChange} required type="text" placeholder="Enter location" />
            </Form.Group>

            <Form.Group controlId="formEventDescription">
              <Form.Label>Event Description</Form.Label>
              <Form.Control name='eventdetails' onChange={handleChange} required as="textarea" placeholder="Enter description" />
            </Form.Group>

            <Form.Group controlId="formStartDateTime">
              <Form.Label>Start Date & Time</Form.Label>
              <DateTimePicker
                onChange={onChange}
                value={dateTime}
              />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={(e) => { handleSubmit(e) }}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}