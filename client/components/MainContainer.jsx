import React, { useState, useEffect } from "react";
import Profile from './Profile.jsx';
import EventsFeed from './EventsFeed.jsx';
import Notnav from './Navbar.jsx';
import axios from 'axios';
import { Card, Button, Col, Row, Container } from 'react-bootstrap';
import AddSearchEvent from './AddSearchEvent.jsx';

export default function MainContainer() {

  const [userName, setUserName] = useState("");
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`/api/info?userName=${userName}`)
      .then((res) => {
        console.log(res.data);
        let userInfo = {
          username: res.data.users.username,
          firstname: res.data.users.firstname,
          lastname: res.data.users.lastname,
          profilephoto: res.data.users.profilephoto,
        }
        let eventsInfo = res.data.events;
        setUser(userInfo);
        setEvents(eventsInfo);
        setUserName(res.data.users.username);
      })
  }, []);

  function handleUserPageChange(username) {
    console.log('username:', username)
    setUserName(username);
  }

  function handleCreateEvent(event) {
    let { eventtitle, eventlocation, eventdate, eventstarttime, eventdetails } = event;
    axios.post(`/api/create?userName=${userName}`, { eventtitle, eventlocation, eventdate, eventstarttime, eventdetails })
      .then((res) => {
        console.log(res.data);
        // let userInfo = {
        //   userName: res.data.users.username,
        //   firstName: res.data.users.firstname,
        //   lastName: res.data.users.lastname,
        //   profilePicture: res.data.users.profilephoto,
        // }
        // let eventsInfo = res.data.events;
        // setUser(userInfo);
        // setEvents(eventsInfo);
      })
    event.attendees = [{
      username: user.username,
      profilephoto: user.profilephoto
    }];
    const newEvents = [event].concat(events);
    console.log("updated events:", newEvents);
    setEvents(newEvents);
  }

  function handleSearchEvent(event) {
    console.log("Main Container:", event)
    // ADD
    axios.post(`/api/add?eventtitle=${event.eventtitle}`)
      .then((res) => {
        console.log(res.data);
        event.attendees.push(
          {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            profilephoto: user.profilephoto
          });
        const newEvents = [event].concat(events);
        console.log("updated events:", newEvents);
        setEvents(newEvents);
      })
    // END ADD
    // event.attendees.push(
    //   {
    //     username: user.username,
    //     profilephoto: user.profilephoto
    //   });
    // const newEvents = [event].concat(events);
    // console.log("updated events:", newEvents);
    // setEvents(newEvents);
  }

  return (
    <div className="myContainer">
      <Notnav />
      <div className="container">
        <Container className="header">
          <Profile {...user} />
          <AddSearchEvent addEvent={handleCreateEvent} searchEvent={handleSearchEvent} events={events} />
        </Container>
        <EventsFeed
          events={events}
          userUpdate={handleUserPageChange}
        />
      </div>
    </div>
  );
}