import React, { useState, useEffect } from "react";
import { Media, Form, Button } from 'react-bootstrap';

export default function Content({ eventmessages }) {

  // ====================== WHERE JEN'S NON-WORKING CODE BEGINS ======================
  // ====================== WHERE JEN'S NON-WORKING CODE BEGINS ======================
  // ====================== WHERE JEN'S NON-WORKING CODE BEGINS ======================
  // ====================== WHERE JEN'S NON-WORKING CODE BEGINS ======================
  // ====================== WHERE JEN'S NON-WORKING CODE BEGINS ======================

  //   let messages = [];
  //   if (content) {
  //     messages = content.map((message, index) => {
  //       return (
  //         <div className="messageBox" key={`Content${index}`}>
  //           <div className="userMessage">
  //             <img src={message.profilephoto}></img>
  //           </div>
  //           <div className="message" key={`Content${index}`} >
  //             <p className="messageName">{message.firstname} {message.lastname}</p>
  //             <p className="messageText">{message.text}</p>
  //             <p className="messageTime">{message.time}</p>
  //           </div>
  //         </div>
  //       )
  //     });
  //   }

  //   function handleCommentSubmit(event) {
  //     console.log("Content.jsx:", event)

  //     const incomingMessage = document.getElementsByName('comment-form').value;
  //     // ADD
  //     axios.post(`/api/add?eventtitle=${event.eventtitle}`)
  //       .then((res) => {
  //         console.log(res.data);
  //         event.attendees.push(
  //           {
  //             username: user.username,
  //             firstname: user.firstname,
  //             lastname: user.lastname,
  //             profilephoto: user.profilephoto
  //           });
  //         const newEvents = [event].concat(events);
  //         console.log("updated events:", newEvents);
  //         setEvents(newEvents);
  //       })
  //     // END ADD

  //     //clear form data
  //     document.getElementsByName('comment-form')[0].reset();
  //   }


  //   return (
  //     <div className="eventContent">
  //       <h4>Comments</h4>
  //       <div className="messages">
  //         {messages}
  //       </div>
  //       <Form name='comment-form'>
  //         <Form.Group controlId="exampleForm.ControlTextarea1">
  //           <Form.Label>Add a Comment:</Form.Label>
  //           <Form.Control as="textarea" rows="2" />
  //         </Form.Group>
  //         <Button variant="primary" type="submit" onClick={(e) => { handleCommentSubmit(e) }}>
  //           Submit
  //         </Button>
  //       </Form>
  //     </div>
  //   );
  // }

  // ====================== WHERE STELLA'S WORKING CODE BEGINS ======================
  // ====================== WHERE STELLA'S WORKING CODE BEGINS ======================
  // ====================== WHERE STELLA'S WORKING CODE BEGINS ======================
  // ====================== WHERE STELLA'S WORKING CODE BEGINS ======================
  // ====================== WHERE STELLA'S WORKING CODE BEGINS ======================

  const [cont, setCont] = useState(eventmessages);
  const [comment, setComment] = useState("")

  let messages = [];
  if (cont) {
    messages = cont.map((message, index) => {
      return (
        <div className="messageBox" key={`Content${index}`}>
          <div className="userMessage">
            <img src={message.profilephoto}></img>
          </div>
          <div className="message" key={`Content${index}`} >
            <p className="messageName">{message.firstname} {message.lastname}</p>
            <p className="messageText">{message.text}</p>
            <p className="messageTime">{message.time}</p>
          </div>
        </div>
      )
    });
  }

  const handleChange = (e) => {
    setComment(e.target.value)
  }

  function handleCommentSubmit(e) {
    document.getElementsByName('comment-form')[0].value; // added
    e.preventDefault();
    const date = new Date();
    const newContent = cont.concat([{ text: comment, time: date.toTimeString() }])
    setCont(newContent)
    //clear form data
    document.getElementsByName('comment-form')[0].reset();
  }

  return (
    <div className="eventContent">
      <h4>Comments</h4>
      <div className="messages">
        {messages}
      </div>
      <Form name='comment-form'>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Add a Comment:</Form.Label>
          <Form.Control as="textarea" rows="2" onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={(e) => { handleCommentSubmit(e) }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}