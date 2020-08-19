const fetch = require('node-fetch');
const FB = require('fb')

const fbController = {};

fbController.oAuth = (req, res, next) => {

  const redirect_uri = 'http://localhost:8080/api/login/FB'
  const app_id = 2445427332416583
  const scope = 'public_profile,email'

  res.locals.url = `https://www.facebook.com/v8.0/dialog/oauth?client_id=${app_id}&redirect_uri=${redirect_uri}&scope=${scope}`
  
  return next();
};

fbController.afterConsent = (req, res, next) => {

  const code = req.query.code;
  const redirect_uri = 'http://localhost:8080/api/login/FB'
  const app_id = 2445427332416583
  const client_secret = '6bd189482d27459c46d73ee1417a3126';
  
  const url = `https://graph.facebook.com/v8.0/oauth/access_token?client_id=${app_id}&redirect_uri=${redirect_uri}&client_secret=${client_secret}&code=${code}`

  fetch(url, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => {
      res.locals.provider = 'facebook';
      res.locals.token = response.access_token;
      return next()
    })
    .catch(err => console.log(err));
};

module.exports = fbController;
