const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const upload = require('./upload')
// const cors = require('cors');
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })

const app = express();
const apiRouter = require('./routers/api');

// BODY PARSERS & COOKIE PARSER
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

// SERVE UP STATIC FILES
app.use(express.static(path.join(__dirname, '../client/assets')));

// const corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200,
// }
// app.use(cors(corsOptions)); // Enable all cors requests

app.use(fileUpload());

app.use('/dist', express.static(path.join(__dirname, '../dist')));

// SERVE INDEX.HTML ON THE ROUTE '/'
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// API ROUTER
app.use('/api', apiRouter);

// HANDLING UNKNOWN URLS
app.use('*', (req, res) => {
  res.status(404).send('URL path not found');
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(401).send(err.message); // WHAT IS FRONT-END EXPECTING? JSON OR STRING?
});

//app.listen(3000); //listens on port 3000 -> http://localhost:3000/
app.listen(process.env.PORT || 3000);
module.exports = app;
