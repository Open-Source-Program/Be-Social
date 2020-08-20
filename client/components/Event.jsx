import React, { useRef, useState, useEffect } from "react";
import EventAttendees from './EventAttendees.jsx';
import Content from './Content.jsx';
import FileUpload from './Fileupload.jsx';
import Media from './Media.jsx';
import { ListGroup, Container, Row, Jumbotron, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

export default function Event(props) {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [data, getFile] = useState({ name: "", path: "" });
  const [progress, setProgess] = useState(0);
  const el = useRef();

  const handleChange = (e) => {
    e.preventDefault();
    setProgess(0);
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  }

  const uploadFile = (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log('typeof file in uploadFile: ', typeof file)
    console.log('file in uploadFile: ', file)
    console.log('filename in uploadFile: ', filename)
    console.log('typeof filename in uploadFile: ', typeof filename)
    formData.append('file', file, filename);

    axios.post('/api/upload', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      content: formData,
      onUploadProgress: (ProgressEvent) => {
        let progress = Math.round(
          ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
        setProgess(progress);
        console.log('=======> progress updated in state')
      }
    }).then(res => {
      console.log(res);
      getFile({
        name: res.data.name,
        path: '/' + res.data.path
      })
    }).catch(err => {
      console.log('Fileupload.jsx error: ', err);

    })
  }

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
          <div className="eventBottom">
            <Content className="eventMessages" {...props} />
            <div className="mediaContainer">
              <FileUpload className="mediaUpload" />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}