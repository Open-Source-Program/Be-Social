const db = require("../models/models");
const queries = require("../utils/queries");
const e = require("express");
const eventController = {};

// DELETE EVENT
eventController.deleteEvent = (req,res,next) => {
  const eventid = req.query.eventid
  const queryString = `
  DELETE FROM usersandevents WHERE eventid=${eventid};
  DELETE FROM events WHERE eventid = ${eventid};
  `
  db.query(queryString)
  .catch(err => {
    return next({
      log: `Error occurred with queries.deleteEvent OR eventController.deleteEvent middleware: ${err}`,
      message: { err: "An error occured with SQL when retrieving events information." },
    });
  })
  next();
}


eventController.getFullEvents = (req, res, next) => {

  const queryString = queries.userEvents;
  const queryValues = [res.locals.allUserInfo.userid]; //user will have to be verified Jen / Minchan
  db.query(queryString, queryValues)
    .then(data => {
      if (!data.rows[0]) {
        res.locals.allEventsInfo = [];
      } else {
        res.locals.allEventsInfo = data.rows;
      }
      return next();
    })
    .catch(err => {
      return next({
        log: `Error occurred with queries.userEvents OR eventController.getFullEvents middleware: ${err}`,
        message: { err: "An error occured with SQL when retrieving events information." },
      });
    })
};

eventController.getAllAttendees = async (req, res, next) => {
  const allEvents = res.locals.allEventsInfo; // ALL EVENTS FOR THAT USER
  const arrayOfEventTitles = []; // ['marc birthday', 'minchan birthday' ... ]
  for (const event of allEvents) {
    arrayOfEventTitles.push(event.eventtitle);
  }

  res.locals.attendees = [];
  const queryString = queries.selectEventAttendees;

  const promises = [];

  for (let i = 0; i < arrayOfEventTitles.length; i++) {
    const result = new Promise((resolve, reject) => {
      try {
        const queryResult = db.query(queryString, [arrayOfEventTitles[i]]);
        return resolve(queryResult)
      } catch (err) {
        return reject(err);
      }
    })
    promises.push(result);
  }

  const resolvedPromises = Promise.all(promises)
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        const container = [];
        data[i].rows.forEach(obj => {
          container.push(obj.username);
        })
        res.locals.attendees.push(container);
      }
      return next();
    })
    .catch(err => console.log('promise.all err: ', err));

  // const resolvedPromises = Promise.all(promises)
  // .then(data => {
  //   for(let i = 0; i < data.length; i++ ) {
  //     console.log('data: ', data[i].rows);
  //     res.locals.attendees.push(data[i].rows);
  //     console.log('RES.LOCALS.ATTENDEES: ', res.locals.attendees);
  //   }
  //   return next();
  // })
  // .catch(err => console.log('promise.all err: ', err));
}

eventController.createEvent = (req, res, next) => {
  // const { eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails } = req.body;
  const { userid, username } = res.locals.allUserInfo;

  const queryString = queries.createEvent;
  // const queryValues = [ eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails, userid, username, {} ];
  //   const queryValues = ['minchan birthday', '9/15/2020', '06:00 PM', '09:00 PM', 'golf course', 'play minigolf birthday', userid, username, "{'hey when is it again', 'happy birthday!', 'sorry can\'t make it'}"]
  //   db.query(queryString, queryValues)
  //     .then(data => {
  let { eventid, eventtitle, eventlocation, eventdate, eventstarttime, eventdetails } = req.body;
  console.log('eventController.createEvent ', req.body);
  const queryValues = [eventtitle, eventdate, eventstarttime, eventstarttime, eventlocation, eventdetails, userid, username, "{}"];
  db.query(queryString, queryValues)
    .then(data => {
      console.log('>>> eventController.createEvent DATA ', data);
      res.locals.eventID = data.rows[0];
      return next();
    })
    .catch(err => {
      console.log('>>> eventController.createEvent ERR ', err);
      return next({
        log: `Error occurred with queries.createEvent OR eventController.createEvent middleware: ${err}`,
        message: { err: "An error occured with SQL when creating event." },
      });
    })
};

eventController.addNewEventToJoinTable = (req, res, next) => {
  console.log('eventController.addNewEventToJoinTable')
  const queryString = queries.addNewEventToJoinTable;
  const queryValues = [res.locals.eventID.eventid]
  db.query(queryString, queryValues)
    .then(data => {
      // WE DON'T ACTUALLY USE THIS ANYWHERE - FOR DEBUGGING AND TESTING ONLY
      res.locals.usersandevents = data.rows[0];
      return next();
    })
    .catch(err => {
      console.log('>>> eventController.addNewEventToJoinTable ERR', err);
      return next({
        log: `Error occurred with queries.addtoUsersAndEvents OR eventController.addNewEventToJoinTable middleware: ${err}`,
        message: { err: "An error occured with SQL when adding to addtoUsersAndEvents table." },
      });
    })
};

eventController.verifyAttendee = (req, res, next) => {
  const title = req.query.eventtitle;
  const { username } = res.locals.allUserInfo
  const queryString = queries.selectEventAttendees;
  const queryValues = [title];
  db.query(queryString, queryValues)
    .then(data => {
      console.log('data: ', data);
      const attendees = [];
      for (const attendeeObj of data.rows) {
        attendees.push(attendeeObj.username);
      }
      console.log(attendees);
      if (attendees.includes(username)) {
        return next({
          log: `Error: User is already an attendee`,
          message: { err: "User is already an attendee" },
        });
      } else {
        res.locals.eventID = data.rows[0].eventid;
        res.locals.eventTitle = data.rows[0].eventtitle;
        res.locals.eventDate = data.rows[0].eventdate;
        res.locals.eventStartTime = data.rows[0].eventstarttime;
        res.locals.eventEndTime = data.rows[0].eventendtime;
        res.locals.eventDetails = data.rows[0].eventdetails;
        res.locals.eventLocation = data.rows[0].eventlocation;
        return next();
      }
    })
    .catch(err => {
      return next({
        log: `Error occurred with queries.selectEventAttendees OR eventController.verifyAttendee middleware: ${err}`,
        message: { err: "An error occured with SQL when verifying if user attended said event." },
      });
    })
}

//  (userid, username, eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventdetails, eventlocation)
eventController.addAttendee = (req, res, next) => {
  const title = req.query.eventtitle

  const { userid, username } = res.locals.allUserInfo
  // eventsID is saved in res.locals.eventID

  const queryString = queries.addUserToEvent;
  const queryValues = [
    userid,
    username,
    res.locals.eventID,
    title,
    res.locals.eventDate,
    res.locals.eventStartTime,
    res.locals.eventEndTime,
    res.locals.eventDetails,
    res.locals.eventLocation,
  ];

  db.query(queryString, queryValues)
    .then(data => {
      console.log('data from addAttendee: ', data);
      return next();
    })
    .catch(err => {
      return next({
        log: `Error occurred with queries.addUserToEvent OR eventController.addAttendee middleware: ${err}`,
        message: { err: "An error occured with SQL adding a user to an existing event as an attendee." },
      });
    })
};

// eventController.allEvents = (req, res, next) => {

//   const queryString = queries.getAllEvents;

//   db.query(queryString)
//     .then(data => {
//       if (!data.rows) {
//         res.locals.allEventsInfo = [];
//       } else {
//         console.log('eventData', data.rows)
//         const eventAndUserDataQueryString = queries.getAttendeeEvents;
//         db.query(eventAndUserDataQueryString).then(eventAndUserData => {
//           console.log('eventAndUserData', eventAndUserData.rows)
//           const mergedTable = data.rows.map(e => {
//             const attendees = eventAndUserData.rows.filter(entry => entry.eventid == e.eventid)
//             e.attendees = attendees;
//             return e;
//           })
//           res.locals.allEventsInfo = mergedTable
//           console.log("merged table", res.locals.allEventsInfo)
//           return next();
//         })
//       }

//     })
//     .catch(err => {
//       return next({
//         log: `Error occurred with queries.getAllEvents OR eventController.allEvents middleware: ${err}`,
//         message: { err: "An error occured with SQL when retrieving all events information." },
//       });
//     })
// };

eventController.allEvents = async (req, res, next) => {
  try {
    const queryString1 = queries.getAllEvents;
    const queryString2 = queries.getEventAllAttendees;
    const queryString3 = queries.getEventMessages;
    const events = await db.query(queryString1)
    const attendees = await db.query(queryString2)
    const messages = await db.query(queryString3)

    // console.log('========> events.rows: ', events.rows);
    // console.log('========> attendees.rows: ', attendees.rows);
    // console.log('========> messages.rows: ', messages.rows);

    if (!events.rows) res.locals.allEventsInfo = [];
    else {
      events.rows.forEach((eventObj, i) => {
        const eventAttendeeList = attendees.rows.filter(userObj => userObj.eventid == eventObj.eventid);
        // console.log('eventAttendeeList: ', eventAttendeeList)
        eventObj.attendees = eventAttendeeList;
        // console.log('eventObj: ', eventObj)

        const eventMessageList = messages.rows.filter(messageObj => messageObj.eventtitle == eventObj.eventtitle);
        // console.log('eventMessageList: ', eventMessageList)
        eventObj.content = eventMessageList
        // console.log('eventObj: ', eventObj)
      })
      res.locals.allEventsInfo = events.rows;
      // console.log('events after insertion of attendees & messages: ', events.rows);
      console.log('eventController.allEvents hit and moving on!')
    }
    return next();
  } catch (err) {
    return next({
      log: `Error occurred with queries.getAllEvents OR eventController.allEvents middleware: ${err}`,
      message: { err: "An error occured with SQL when retrieving all events information." },
    });
  };
}


eventController.getUserDetail = (req, res, next) => {

  const countObj = []; // each element should how many attendees are for each event in succession;
  res.locals.attendees.forEach(arr => {
    countObj.push(arr.length);
  })

  const allUsernames = res.locals.attendees.flat(Infinity);
  console.log('FLATTENED USERNAMES', allUsernames);

  const queryString = queries.userInfo;

  const promises = [];

  for (let i = 0; i < allUsernames.length; i++) {
    const result = new Promise((resolve, reject) => {
      try {
        const queryResult = db.query(queryString, [allUsernames[i]]);
        return resolve(queryResult)
      } catch (err) {
        return reject(err);
      }
    })
    promises.push(result);
  }

  const resolvedPromises = Promise.all(promises)
    .then(data => {

      res.locals.userDetail = [];

      for (let i = 0; i < countObj.length; i += 1) {
        let turns = countObj[i]
        let count = 0;
        const container = [];
        while (count < turns) {
          const minchan = data.shift()
          container.push(minchan.rows[0]);
          count++;
        }
        res.locals.userDetail.push(container);
      }
      return next();
    })
    .catch(err => console.log('promise.all err: ', err));
}

eventController.consolidation = (req, res, next) => {
  const consolidatedEvents = { ...res.locals.allEventsInfo };
  res.locals.userDetail.forEach((arr, i) => {
    consolidatedEvents[i].attendees = arr;
  })
  return next();
}

eventController.filterForUser = (req, res, next) => {
  const { userid } = res.locals.allUserInfo

  const filtered = res.locals.allEventsInfo.filter(event => event.attendees.some(attendee => attendee.userid === userid))
  console.log("eventController.filterForUser, filtered", filtered)
  res.locals.allEventsInfo = filtered;
  return next();
}

eventController.addMessage = (req, res, next) => {
  // console.log('eventController.addMessage first line hit, req.body and req.query: ', req.body, req.query)
  // console.log('eventController.addMessage first line hit!');
  // console.log('eventController.addMessage req.body: ', req.body)
  // console.log('eventController.addMessage req.query: ', req.query)
  const eventtitle = req.query.eventtitle;
  // console.log('eventController.addMessage eventtitle: ', eventtitle)
  const { userid, username, eventid, messagetext, messagedate, messagetime } = req.body;
  console.log('hihihi');
  const time2 = new Date(Date.now()).toISOString().replace('T', ' ').replace('Z', '');
  console.log(time2);
  // const dateObj = new Date(messagetime);
  // const converted = dateObj.toISOString();
  console.log('ACTUAL TIME CONVERTED: ', time2);
  const queryString = queries.addMessageToEvent;
  const queryValues = [userid, username, eventid, eventtitle, messagetext, messagedate, time2];

  console.log('I AM JENNIFER: ', queryValues);

  db.query(queryString, queryValues)
    .then(data => {
      console.log('data from addMessage: ', data);
      return next();
    })
    .catch(err => {
      return next({
        log: `Error occurred with queries.addMessageToEvent OR eventController.addMessage middleware: ${err}`,
        message: { err: "An error occured with SQL adding a comment to an existing event." },
      });
    })
};



module.exports = eventController;
