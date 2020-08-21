import React, { useState, useEffect } from "react";
import { Media, Form, Button } from 'react-bootstrap';

export default function Content(props) {
  // console.log('=========> Content.jsx props: ', props)
  const [cont, setCont] = useState(props.content);
  // console.log('=========> Content.jsx cont: ', cont)
  // console.log('=========> Content.jsx cont.length: ', cont.length)
  const [comment, setComment] = useState("")
  // let [messages, setMessages] = useState([]);

  let messages = [];
  if (cont && cont.length) {
    messages = cont.map((message, index) => {
      return (
        <div className="messageBox" key={`Content${index}`}>
          <div className="userMessage">
            <img src={message.profilephoto}></img>
          </div>
          <div className="message" key={`Content${index}`} >
            <p className="messageName">{message.username} </p>
            <p className="messageText">{message.messagetext}</p>
            <p className="messageDate">{message.messagedate}</p>
            <p className="messageTime">{message.messagetime}</p>
          </div>
        </div>
      )
    });
  }

  const handleChange = (e) => {
    setComment(e.target.value);
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
    const date = new Date();
    // newContent is what we're posting back
    const newContent = { eventid: props.eventid, eventtitle: props.eventtitle, messagetext: comment, messagedate: date.toDateString(), messagetime: date.toTimeString() }
    console.log('Content.jsx newContent: ', newContent)
    //clear form data
    document.getElementsByName('comment-form')[0].reset();

    props.handleCreateMessage(newContent);
    const updatedCont = [cont].concat(newContent)

    setCont(updatedCont)
    window.location.reload(true);
  }


  return (
    <div className="eventContent">
      <h4 className="mediaTitle">Comments</h4>
      <div className="messages">
        {messages}
      </div>
      <Form name='comment-form'>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Add a Comment:</Form.Label>
          <Form.Control as="textarea" rows="2" onChange={handleChange} />
        </Form.Group>
        <Button id="submit" variant="primary" type="submit" onClick={(e) => { handleCommentSubmit(e) }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}