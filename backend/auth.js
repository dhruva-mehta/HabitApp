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
    User.findOne({email:req.body.username})
        .then(found=>{console.log(found);res.json(found)}).catch(err=>{console.log('not found')});
  });

    router.post('/profile/edit', function(req, res) {
      const updates = {
          name: req.body.name,
          email: req.body.email,
          imgUrl: req.body.imgUrl
      };
      console.log(updates);
      User.findByIdAndUpdate(req.body.id, updates)
          .then(found=>res.json(found)).catch(err=>{console.log(err)});
    })

  router.get('/users', function(req,res) {
    User.find().then(found=>res.json(found)).catch(err=>{console.log(err)})
  })

  router.post('/addUser', function(req,res){
    User.findById(req.body.self).then(self=>{
      User.findById(req.body.id).then(toAdd=>{
          let tempArr = toAdd.requests.slice();
          tempArr.push(self);
          const updates = {
              requests: tempArr
          }
          User.findByIdAndUpdate(req.body.id, updates)
              .then(saved=>res.json(saved)).catch(err=>{console.log(err)})
      })
    })
  })

  router.post('/accept', function(req,res){
    User.findById(req.body.toAdd._id).then(toAdd=>{
      let toAddFriends = toAdd.friends.slice();
      toAddFriends.push(req.body.self);
      console.log(toAddFriends);
      let updates = {
        friends: toAddFriends,
      }
      User.findByIdAndUpdate(req.body.toAdd._id, updates, {new: true}).then(saved=>{"saved", console.log(saved)}).then(()=>{
        User.findById(req.body.self._id)
        .then(self=>{
          console.log("self", self)
          let selfFriends = self.friends.slice();
          selfFriends.push(req.body.toAdd);
          let selfRequests = self.requests.filter(obj=>obj._id!==req.body.toAdd._id);
          let updates = {
            friends: selfFriends,
            requests: selfRequests,
          }
          console.log(updates);
          User.findByIdAndUpdate(req.body.self_id, updates, {new: true}).then(saved=>res.json(saved))
        })
      })
    }).catch(err=>{console.log(err);});
  })

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
};
