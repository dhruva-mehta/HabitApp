const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('./../models/models').User

module.exports = function(passport) {

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
      if (!validateReq(req.body)) {
          throw 'Passwords do not match'
      }
      console.log(req.body);
      var u = new User({
        // Note: Calling the email form field 'username' here is intentional,
        //    passport is expecting a form field specifically named 'username'.
        //    There is a way to change the name it expects, but this is fine.
          name: req.body.firstname,
          email: req.body.username,
          password: req.body.password,
      });

      u.save().then(saved => res.json(saved)).catch(err=>{console.error(err)});
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
};
