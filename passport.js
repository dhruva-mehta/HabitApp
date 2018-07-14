var express = require('express');
var session = require('express-session')
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/models').User;
var auth = require('./backend/auth');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connection.on('connected', function(){
  console.log('Connected to MongoDB');})
mongoose.connect(process.env.MONGODB_URI);

// Passport stuff here
app.use(session({
  secret: process.env.SECRET,
  name: 'Catscoookie',
  store: new MongoStore({mongooseConnection:mongoose.connection}),
  proxy: true,
  resave: true,
  saveUninitialized: true,
}));

// Session info here

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Serialize
passport.serializeUser(function(user, done){
  done(null, user._id);
})

// Passport Deserialize
passport.deserializeUser(function(id,done){
  User.findById(id, function(err, user){
    done(null, user);
  })
})

// Passport Strategy
passport.use(new LocalStrategy(
  function(username,password,done){
    console.log(username);
    User.findOne({email: username}, function(err,user){
      if (err){
        console.error(err);
        return done(err);
      }

      if (!user){
        console.log(user);
        return done(null, false, {message: 'Incorrect username'})
      }

      if (user.password !== password){
        return done(null, false, {message: 'Incorrect password'});
      }

      return done(null, user);

    })
  }
));

app.use('/', auth(passport));

module.exports = app;
