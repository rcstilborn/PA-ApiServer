'use strict';

//dependencies
var passport = require('passport'),
  bodyParser = require('body-parser'),
     express = require('express'),
      multer = require('multer');


// Create the express app
var app = express();

// Set up logging
app.use(require('morgan')('dev'));

// Set up file uploading
app.use(multer({dest:'./files/tmp'}).single('file'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

// setup passport
require('./auth')(app, passport);

// setup routes
require('./routes')(app, passport);


app.listen(3000, function(){
  console.log('Server is running on port 3000');
});
