const express = require("express");
const router = express.Router();
const path = require('path');
const fileController = require('../controllers/fileController');
const cookieController = require('../controllers/cookieController');
const eventController = require('../controllers/eventController');
const loginController = require('../controllers/loginController');
const fbController = require('../controllers/fbController');

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

router.use('/logout', // SWITCH THIS TO POST REQUEST!!
  cookieController.removeCookie,
  (req, res) => {
    return res.status(200).json('Successful logout.');
  });

// CREATE A NEW EVENT

router.post('/create',
  fileController.verifyUser,
  fileController.getUser,
  eventController.createEvent,
  eventController.addNewEventToJoinTable,
  (req, res) => {
    return res.status(200).json('Event succcessfully created.');
  });

// ADD USER TO AN EXISTING EVENT

router.post('/add',
  fileController.getUser,
  eventController.verifyAttendee,
  eventController.addAttendee,
  (req, res) => {
    return res.status(200).json('User successfully added as attendee.');
  });

router.get('/events',
  eventController.allEvents,
  (req, res) => {
    return res.status(200).json(res.locals.allEventsInfo);
  }
)

// ADD MESSAGES TO EVENT
router.post('/message',
  eventController.allEvents,
  eventController.addMessage,
  (req, res) => {
    return res.status(200).json('User successfully added a comment');
  }
)

module.exports = router;
