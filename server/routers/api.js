const express = require("express");
const router = express.Router();
const path = require('path');
const fileController = require('../controllers/fileController');
const cookieController = require('../controllers/cookieController');
const eventController = require('../controllers/eventController');
const loginController = require('../controllers/loginController');
const fbController = require('../controllers/fbController');

//DELETE EVENT
router.delete('/delete',
  eventController.deleteEvent,
  (req, res) => {
    res.status(200).send('event deleted successfully!! yay.')
  }
)

//UPDATE EVENT
router.put('/update',
  eventController.updateEvent, 
  (req, res) => {
    // res.status(200).json(res.locals.updatedEvent);
    res.status(200).send('success');
  }
);

// EXISING USER LOGIN
/* FACEBOOK OAUTH LOGIN */

router.get('/loginFB',
  fbController.oAuth,
  (req, res) => {
    return res.redirect(res.locals.url);
  });

router.get('/login/FB',
  fbController.afterConsent,
  cookieController.setFacebookCookie,
  fileController.createUser,
  (req, res) => {
    return res.redirect('/');
  });

/* GOOGLE OAUTH LOGIN */

router.get('/loginG',
  loginController.oAuth,
  (req, res) => {
    return res.redirect(res.locals.url);
  });

router.get('/login/G',
  loginController.afterConsent,
  cookieController.setGoogleCookie,
  fileController.createUser,
  (req, res) => {
    return res.redirect('/');
  });

// REVISIT WEBSITE AFTER LEAVING, OR VISITING SOMEONE ELSE'S PROFILE PAGE

// /info IS THE ENDPOINT that is auto-hit whenever a user logins, also when a user navigates away from our app, i.e. to google.com, and navs back to our app
router.get('/info',
  cookieController.isLoggedIn, // this is really only is applicable for the same user
  fileController.getUser,
  eventController.allEvents, // COMMENT OUT IF IT BREAKS
  eventController.filterForUser, // COMMENT OUT IF IT BREAKS
  // eventController.getMessages, // ADDING IN MESSAGES
  // eventController.getFullEvents,
  // eventController.getAllAttendees,
  // eventController.getUserDetail,
  // eventController.consolidation,
  (req, res) => {
    const responseObj = {
      users: res.locals.allUserInfo,
      events: res.locals.allEventsInfo,
    };
    console.log('responseObj: ', responseObj);
    return res.status(200).json(responseObj);
  });

// LOGGING OUT

router.get('/logout',
  cookieController.removeCookie,
  (req, res) => {
    return res.redirect('/');
  });

// CREATE A NEW EVENT

/**
 * ORDER OF OPERATION FOR EVENTS:
 * 1. /events =====> we grab all events
 * 2. /add or /create =======> user adds themself to an event, or user creates a new event
 * 3. /message ========> user posts a comment on a specific event
 */

// GET FULL EVENT FEED - ALL EVENTS EVER
router.get('/events',
  eventController.allEvents,
  (req, res) => {
    return res.status(200).json(res.locals.allEventsInfo);
  }
)

// CREATE NEW CALENDAR EVENT
router.post('/create',
  fileController.verifyUser,
  fileController.getUser,
  eventController.createEvent,
  eventController.createCooking,
  eventController.addNewEventToJoinTable,
  (req, res) => {
    return res.status(200).json('Event succcessfully created.');
  });

// CREATE NEW CALENDAR EVENT
// router.post('/cooking',
//   fileController.verifyUser,
//   fileController.getUser,
//   eventController.createCooking,
//   eventController.addCookingEventToJoinTable,
//   (req, res) => {
//     return res.status(200).json('Event succcessfully created.');
//   });


// ADD USER TO EXISTING EVENT
router.post('/add',
  fileController.getUser,
  eventController.verifyAttendee,
  eventController.addAttendee,
  (req, res) => {
    return res.status(200).json('User successfully added as attendee.');
  });

router.post('/message',
  // eventController.allEvents,
  // PROBABLY NEEED TO ADD GETEVENT MIDDLEWARE HERE TO FIX MESSAGE GLITCH? MAYBE
  // fileController.getUser,
  eventController.addMessage,
  (req, res) => {
    return res.status(200).json('User successfully added a comment');
  }
)

module.exports = router;
