/**
 * Created by richard on 4/11/16.
 */
'use strict';

exports = module.exports = function(app, passport) {
  var BasicStrategy = require('passport-http').BasicStrategy;

  passport.use(new BasicStrategy({},
    function(username, password, done) {
      if (username.valueOf() === 'yourusername' && password.valueOf() === 'yourpassword') {
        console.log("User authorized");
        return done(null, {id: "123456"});
      } else {
        console.log("User not authorized");
        return done(null, false, {message: 'Unknown user or invalid password'});
      }
    }
  ));
};