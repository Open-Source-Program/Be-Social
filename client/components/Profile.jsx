import React, { useState, useEffect } from "react";
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStarHalf } from '@fortawesome/free-solid-svg-icons'

export default function Profile(props) {
  return (
    <div className="profile">
      {/* <h4>Profile</h4> */}
      {/* <Card style={{ width: '18rem' }}> */}
      <img src={props.profilephoto} />
      <div className="profilecard">
        <Card.Body>
          <Card.Title>
            <b className="name">{props.firstname} {props.lastname}</b>
            <span>
              <FontAwesomeIcon className="staricon" icon={faStar} />
              <FontAwesomeIcon className="staricon" icon={faStar} />
              <FontAwesomeIcon className="staricon" icon={faStar} />
              <FontAwesomeIcon className="staricon" icon={faStarHalf} />
            </span>
          </Card.Title>
          <Card.Text>
            <p>
              <b>last logged in: </b><em>{new Date().toDateString()}</em><br />
              <b>username: </b><em>{props.username}</em><br />
              <b>status: </b><em>gold</em>
            </p>
          </Card.Text>
        </Card.Body>
        {/* </Card> */}
      </div>
    </div>
  );
}