const db = require("../models/models");
const queries = require("../utils/queries");
const fetch = require("node-fetch")
const eventController = {};

// DELETE EVENT
eventController.deleteEvent = (req, res, next) => {
  const eventid = req.query.eventid
  const queryString = `
  DELETE FROM usersandevents WHERE eventid=${eventid};
  DELETE FROM eventsandmessages WHERE eventid=${eventid};
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

// UPDATE EVENT
eventController.updateEvent = (req, res, next) => {
  let { eventid, eventtitle, eventlocation, eventdate, eventstarttime, eventdetails } = req.body;
  const queryString = `
  UPDATE events
  SET eventtitle = '${eventtitle}', 
  eventlocation = '${eventlocation}', 
  eventdetails = '${eventdetails}',
  eventstarttime = '${eventstarttime}', 
  eventdate = '${eventdate}'
  WHERE eventid = ${eventid}
  RETURNING *;

  UPDATE usersandevents
  SET eventlocation = '${eventlocation}', 
  eventdetails = '${eventdetails}',
  eventstarttime = '${eventstarttime}', 
  eventdate = '${eventdate}'
  WHERE eventid = ${eventid};
  `


  // const queryValues = [eventtitle, eventdate, eventstarttime, eventstarttime, eventlocation, eventdetails];
  db.query(queryString)
    .then(response => {
      res.locals.updateduser = response[0].rows;
      return next();
    })
    .catch(err => {
      console.log('I AM THE ERRORR: ', err);
      return next({
        log: `Error occurred with queries.updateEvent OR eventController.updateEvent middleware: ${err}`,
        message: { err: "An error occured with SQL when retrieving events information." },
      });
    });
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
  const { userid, username } = res.locals.allUserInfo;

  // const queryValues = [ eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails, userid, username, {} ];
  //   const queryValues = ['minchan birthday', '9/15/2020', '06:00 PM', '09:00 PM', 'golf course', 'play minigolf birthday', userid, username, "{'hey when is it again', 'happy birthday!', 'sorry can\'t make it'}"]
  //   db.query(queryString, queryValues)
  //     .then(data => {
  let { eventid, eventtitle, eventlocation, eventdate, eventstarttime, eventdetails, eventtype } = req.body;
  // console.log('eventController.createEvent: eventtype: ', eventtype);
  if (eventtype == "cooking") return next();
  if (eventtype == "calendar") {
    // console.log('eventController.createEvent ', req.body);
    const queryString = queries.createEvent;
    const queryValues = [eventtitle, eventdate, eventstarttime, eventstarttime, eventlocation, eventdetails, userid, username, "{}", eventtype];
    db.query(queryString, queryValues)
      .then(data => {
        // console.log('>>> eventController.createEvent DATA ', data);
        // data.rows: [ { eventid: 11 } ],
        res.locals.eventTitle = data.rows[0];
        return next();
      })
      .catch(err => {
        // console.log('>>> eventController.createEvent ERR ', err);
        return next({
          log: `Error occurred with queries.createEvent OR eventController.createEvent middleware: ${err}`,
          message: { err: "An error occured with SQL when creating event." },
        });
      })
  }
};

// ==================== CREATE NEW COOKING EVENT
// ==================== CREATE NEW COOKING EVENT
// ==================== CREATE NEW COOKING EVENT

/**
[{
  "id": 143419,
  "title": "&quot;Barbecued&quot; Tofu",
  "image": "https://spoonacular.com/recipeImages/143419-312x231.png",
  "imageType": "png",
  "usedIngredientCount": 2,
  "missedIngredientCount": 2,
  "missedIngredients": [
      {
          "id": 6150,
          "amount": 0.5,
          "unit": "cup",
          "unitLong": "cups",
          "unitShort": "cup",
          "aisle": "Condiments",
          "name": "barbecue sauce",
          "original": "1/2 cup barbecue sauce",
          "originalString": "1/2 cup barbecue sauce",
          "originalName": "barbecue sauce",
          "metaInformation": [],
          "meta": [],
          "image": "https://spoonacular.com/cdn/ingredients_100x100/barbecue-sauce.jpg"
      },
      {
          "id": 2009,
          "amount": 1.0,
          "unit": "tablespoon",
          "unitLong": "tablespoon",
          "unitShort": "Tbsp",
          "aisle": "Spices and Seasonings",
          "name": "chile powder",
          "original": "1 tablespoon pure chile powder",
          "originalString": "1 tablespoon pure chile powder",
          "originalName": "pure chile powder",
          "metaInformation": [
              "pure"
          ],
          "meta": [
              "pure"
          ],
          "image": "https://spoonacular.com/cdn/ingredients_100x100/chili-powder.jpg"
      }
  ],
  "usedIngredients": [
      {
          "id": 98940,
          "amount": 4.0,
          "unit": "",
          "unitLong": "",
          "unitShort": "",
          "aisle": "Bakery/Bread",
          "name": "sub rolls",
          "original": "4 rolls, split (optional)",
          "originalString": "4 rolls, split (optional)",
          "originalName": "rolls, split (optional)",
          "metaInformation": [
              "split"
          ],
          "meta": [
              "split"
          ],
          "extendedName": "split sub rolls",
          "image": "https://spoonacular.com/cdn/ingredients_100x100/french-rolls.jpg"
      },
      {
          "id": 16213,
          "amount": 14.0,
          "unit": "ounces",
          "unitLong": "ounces",
          "unitShort": "oz",
          "aisle": "Refrigerated;Produce;Ethnic Foods",
          "name": "tofu",
          "original": "1 package (14 ounces) regular tofu, firm or extra-firm, drained",
          "originalString": "1 package (14 ounces) regular tofu, firm or extra-firm, drained",
          "originalName": "package regular tofu, firm or extra-firm, drained",
          "metaInformation": [
              "firm",
              "drained"
          ],
          "meta": [
              "firm",
              "drained"
          ],
          "image": "https://spoonacular.com/cdn/ingredients_100x100/tofu.png"
      }
  ],
  "unusedIngredients": [
      {
          "id": 18064,
          "amount": 1.0,
          "unit": "serving",
          "unitLong": "serving",
          "unitShort": "serving",
          "aisle": "Bakery/Bread",
          "name": "bread",
          "original": "bread",
          "originalString": "bread",
          "originalName": "bread",
          "metaInformation": [],
          "meta": [],
          "image": "https://spoonacular.com/cdn/ingredients_100x100/white-bread.jpg"
      },
      {
          "id": 9266,
          "amount": 1.0,
          "unit": "serving",
          "unitLong": "serving",
          "unitShort": "serving",
          "aisle": "Produce",
          "name": "pineapples",
          "original": "pineapples",
          "originalString": "pineapples",
          "originalName": "pineapples",
          "metaInformation": [],
          "meta": [],
          "image": "https://spoonacular.com/cdn/ingredients_100x100/pineapple.jpg"
      }
  ],
  "likes": 11
}]
 */

// ==================== RECIPE API START ====================


/*query search to postgresQL database to get the ingredients for each user.
Needed to use the req.cookie.user_id in order to determine which user is currently on the site */
// const queryString4 = `SELECT name FROM ingredients WHERE user_id=${req.cookies.user_id}`;

// await db.query(queryString4).then((data) => {

//   //queryString is created to insert in to the api request below called get recipes. Ingredients come back as an array.
//   //example --> ['bread', 'chicken', 'cheese', 'lettuce']
//   //queryString example --> 'bread,+chicken,+cheese,+lettuce'
//   let ingredientString = "";
//   for (let i = 0; i < data.rows.length; i++) {
//     ingredientString = ingredientString + ",+" + data.rows[i].name;
//   }

//   //API request string labeled getRecipes used below in Fetch to get information from spoonacular API. 
//   //Always need an API key at the end query (getRecipes) You'll have to request one from the main request. 
//   /*Important!!!!!!!!: Only 150 request can be made per day to the API*/
//   let getRecipes = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientString}&apiKey=`;

//   //FETCH
//   fetch(getRecipes, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("result dataaa", data);
//       res.locals.data = data;
//       return next();
//     })
//     .catch((err) => console.log(err));
// });


// ==================== RECIPE API END ====================

eventController.createCooking = async (req, res, next) => {
  // console.log('eventController.createCooking: req.body: ', req.body);
  // console.log('eventController.createCooking: req.query: ', req.query);
  const { eventid, eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails, eventtype } = req.body;
  // console.log('eventController.createCooking: eventtitle ', eventtitle);
  // console.log('eventController.createCooking: eventtype: ', eventtype);
  // console.log('eventController.createCooking: ingredient: ', eventlocation);
  // console.log('eventController.createCooking: eventdate: ', eventdate);
  // console.log('eventController.createCooking: eventstarttime: ', eventstarttime);
  // console.log('eventController.createCooking: eventdetails: ', eventdetails);

  res.locals.eventTitle = {};
  res.locals.eventTitle.eventtitle = eventtitle;

  if (eventtype == "calendar") return next();
  if (eventtype == "cooking") {
    const ingredient = eventlocation.trim();
    const apiKey = 'a65230a9135c40f4a3d7a5c7b6685cc6'; // Bon-Jay's
    // const apiKey = '4335e4647b4f4cc1b7a027fd1d3b1975'; // Qwen's
    const { userid, username } = res.locals.allUserInfo;
    try {
      let recipeURL = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&apiKey=${apiKey}`;
      await fetch(recipeURL, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((data) => data.json())
        .then((data) => {
          console.log("result data.length", data.length);
          if (data.length === 0) return res.send('NOT A VALID INGREDIENT')
          console.log("result data", data);
          const num = Math.floor(Math.random() * data.length);
          console.log('createCooking number randomizer: ', num)
          res.locals.recipe = data[num];

        })
        .catch((err) => console.log(err));
      // console.log('======> eventController.createCooking res.locals.recipe: ', res.locals.recipe);
      const { id, title, image, usedIngredients } = res.locals.recipe;
      const recipeid = id;
      let ingredientList = [];

      usedIngredients.forEach(ingredientObj => {
        const { id, name, image } = ingredientObj;
        let eachIngredient = { name, id, image };
        // push this into the container from above
        ingredientList.push(eachIngredient);
      });

      // FIRST QUERY: INSERT RECIPES INTO RECIPES TABLE
      const queryString1 = queries.saveRecipe;
      const queryValues1 = [title, recipeid, image]; // (recipename, recipeid, recipeimage)
      await db.query(queryString1, queryValues1)
        .then(data => console.log('========> eventController.createCooking query1 data: ', data))
        .catch(err => console.log('========> eventController.createCooking query1 err: ', err));

      for (let i = 0; i < ingredientList.length; i++) {
        const { name, id, image } = ingredientList[i];
        // SECOND QUERY: INSERT INGREDIENTS INTO INGREDIENTS TABLE
        const queryString2 = queries.saveIngredients;
        const queryValues2 = [name, id, image, recipeid]; // (ingredientname, ingredientid, ingredientimage, recipeid)
        await db.query(queryString2, queryValues2)
          .then(data => console.log('========> eventController.createCooking query2 data: ', data))
          .catch(err => console.log('========> eventController.createCooking query2 err: ', err));
      }

      const queryString3 = queries.createEvent;


      // (eventtitle, eventdate, eventstarttime, eventendtime, eventlocation, eventdetails, eventownerid, eventownerusername, eventmessages, eventtype)
      const queryValues3 = [eventtitle, eventdate, eventstarttime, eventstarttime, eventlocation, eventdetails, userid, username, "{}", eventtype];
      await db.query(queryString3, queryValues3)
        .then(data => {
          console.log('>>> eventController.createCooking DATA ', data);
        })
        .catch(err => {
          console.log('>>> eventController.createEvent ERR ', err);
          return next({
            log: `Error occurred with queries.createEvent OR eventController.createCooking middleware: ${err}`,
            message: { err: "An error occured with SQL when creating event." },
          });
        })
      return next();
    } catch (err) {
      console.log('>>> eventController.createCooking ERR', err);
      return next({
        log: `Error occurred with queries.addtoUsersAndEvents OR eventController.createCooking middleware: ${err}`,
        message: { err: "An error occured with SQL when adding to cooking event table." },
      })
    }
  }
};

eventController.addNewEventToJoinTable = (req, res, next) => {
  // console.log('eventController.addNewEventToJoinTable')
  const queryString = queries.addNewEventToJoinTable;
  // const queryValues = [res.locals.eventID.eventid] // changed this to eventtitle
  // console.log('eventController.addNewEventToJoinTable res.locals.eventTitle.eventtitle', res.locals.eventTitle.eventtitle) // changed this to eventtitle
  const queryValues = [res.locals.eventTitle.eventtitle] // changed this to eventtitle
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
      // console.log('eventController.verifyAttendee attendees: ', attendees);
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
    // console.log('==========> eventController.allEvents req.query: ', req.query); // EMPTY {}
    // console.log('==========> eventController.allEvents req.body:', req.body); // EMPTY {}
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
      // console.log('eventController.allEvents hit and moving on!')
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
  // console.log('FLATTENED USERNAMES', allUsernames);

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
  // console.log("eventController.filterForUser, filtered", filtered)
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
  // console.log('hihihi');
  const time2 = new Date(Date.now()).toISOString().replace('T', ' ').replace('Z', '');
  // console.log(time2);
  // const dateObj = new Date(messagetime);
  // const converted = dateObj.toISOString();
  // console.log('ACTUAL TIME CONVERTED: ', time2);
  const queryString = queries.addMessageToEvent;
  const queryValues = [userid, username, eventid, eventtitle, messagetext, messagedate, time2];

  // console.log('I AM JENNIFER: ', queryValues);

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
