import { Navbar, Nav, Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
// import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons'
import { faBlog } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

export default function Notnav(props) {
  
  console.log('status', props.status);
  console.log(props);
  
  const navOutput = [];

  if (props.status === '') {
    navOutput.push(<a href="/api/loginFB"><Button className="navButton" variant="outline-primary"><FontAwesomeIcon icon={faFacebook} /> Sign Up/Log In</Button></a>)
    navOutput.push(<a href="/api/loginG"><Button className="navButton" variant="outline-primary"><FontAwesomeIcon icon={faGoogle} /> Sign Up/Log In</Button></a>)
  } else if (props.status === 'loggedIn') {
    navOutput.push(<a href="/api/logout"><Button className="navSignOut" variant="outline-primary"><FontAwesomeIcon icon={faSignOutAlt} /> Sign Out</Button></a>)
  }

  return (
    <div className="navcontainer">
      <Navbar expand="lg" className="myNavbar justify-content-between">
        <Nav>
          <div className="iconarea">
            <div className="brand">
              <span className="icon">
                <FontAwesomeIcon className="icon" icon={faBlog} />
              </span>
            </div>
          </div>
        </Nav>
        <Nav>
          <div className="social">
            <span className="projectName">b</span>
            <span className="projectName">e</span>
            <span className="projectName"> </span>
            <span className="projectName">s</span>
            <span className="letter"></span>
            <span className="projectName">c</span>
            <span className="projectName">i</span>
            <span className="projectName">a</span>
            <span className="projectName">l</span>
          </div>
        </Nav>
        <Nav>
          {navOutput}
        </Nav>
      </Navbar>
    </div>
  )
}