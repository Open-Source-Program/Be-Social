const db = require("../models/models.js");
const queries = require("../utils/queries");
const fileController = {};
const FB = require('fb')
const jwtDecode = require('jwt-decode');
// const { serviceusage } = require("googleapis/build/src/apis/serviceusage");
// const e = require("express");
// const fetch = require('node-fetch');

fileController.createUser = async (req, res, next) => {
  
  const { provider } = res.locals
  
  let email;
  let given_name;
  let family_name;
  let picture;;

  if (provider === 'facebook') {
      FB.api(
        `/me?access_token=${res.locals.token}`,
        'GET',
        {"fields":"id,name,email"},
        function(response) {
          email = response.email;
          given_name = response.name.split(' ')[0];
          family_name = response.name.split(' ')[1];
          picture = '../../client/assets/Codesmith.png';
          
          const queryString1 = queries.userInfo;
          const queryValues1 = [email];

          const queryString2 = queries.addUser;
          const queryValues2 = [email, given_name, family_name, picture];
          
          db.query(queryString1, queryValues1) // Does the user exist?
            .then(data => {
              if (!data.rows.length) {
                db.query(queryString2, queryValues2) // If not, create user
                  .then(data => {
                    console.log('NEW USER: ', data.rows[0].username);
                    return next();
                  })
                  .catch(err => {
                    return next({
                      log: `Error occurred with queries.addUser OR fileController.createUser middleware: ${err}`,
                      message: { err: "An error occurred with adding new user to the database." },
                    });
                  })
              } else {
                return next();
              }
            })
            .catch(err => {
              return next({
                log: `Error occurred with queries.userInfo OR fileController.createUser middleware: ${err}`,
                message: { err: "An error occurred when checking user information from database." },
              });
            });
          
        }
        );
      } else if (provider === 'google') {

        const decoded = jwtDecode(res.locals.token);
        email = decoded.email;
        given_name = decoded.given_name;
        family_name = decoded.family_name;
        picture = decoded.picture;
        
        const queryString1 = queries.userInfo;
        const queryValues1 = [email];

        const queryString2 = queries.addUser;
        const queryValues2 = [email, given_name, family_name, picture];
        
        db.query(queryString1, queryValues1) // does user exist?
          .then(data => {
            if (!data.rows.length) {
              db.query(queryString2, queryValues2) // create user
                .then(data => {
                  res.locals.username = data.rows[0].username; // is this superfluous?
                  console.log('NEW USER: ', res.locals.username);
                  return next();
                })
                .catch(err => {
                  return next({
                    log: `Error occurred with queries.addUser OR fileController.createUser middleware: ${err}`,
                    message: { err: "An error occurred with adding new user to the database." },
                  });
                })
            } else {
              return next();
            }
          })
          .catch(err => {
            return next({
              log: `Error occurred with queries.userInfo OR fileController.createUser middleware: ${err}`,
              message: { err: "An error occurred when checking user information from database." },
            });
          });
      }
};

fileController.getUser = (req, res, next) => {

  const { provider } = req.cookies;
  const token = req.cookies.user;
  let decoded;
  let email;

  if (provider === 'facebook') {
    FB.api(
      `/me?access_token=${token}`,
      'GET',
      {"fields":"id,name,email"},
      function(response) {

        email = response.email;

        const queryString = queries.userInfo;
        const queryValues = [email];

        db.query(queryString, queryValues)
          .then(data => {
            console.log('data.rows[0]', data.rows[0]);
            res.locals.allUserInfo = data.rows[0];
            return next();
          })
          .catch(err => {
            return next({
              log: `Error occurred with queries.userInfo OR fileController.getUser middleware: ${err}`,
              message: { err: "An error occured with SQL or server when retrieving user information." },
            });
          })        
      })
  } else if (provider === 'google') {

      decoded = jwtDecode(token);
      email = decoded.email;
      
      const queryString = queries.userInfo;
      const queryValues = [email];

      db.query(queryString, queryValues)
        .then(data => {
          console.log('data.rows[0]', data.rows[0]);
          res.locals.allUserInfo = data.rows[0];
          return next();
        })
        .catch(err => {
          return next({
            log: `Error occurred with queries.userInfo OR fileController.getUser middleware: ${err}`,
            message: { err: "An error occured with SQL or server when retrieving user information." },
          });
        })
  }
};

fileController.verifyUser = (req, res, next) => {

  return next();
  
  // DEPRECATED
  
  // const decoded = jwtDecode(req.cookies.user);
  // const { email } = decoded;

  // if (email == req.query.userName) {
  //   return next();
  // } else {
  //   return next({
  //     log: `Error occurred with fileController.verifyUser`,
  //     code: 401,
  //     message: { err: "Unauthorized Access." },
  //   })
  // }
}

module.exports = fileController;
