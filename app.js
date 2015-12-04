var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Database
var mongo = require('mongodb');
var monk = require('monk');
// link to database path
var db = monk('localhost:27017/bookz');
// user auth
var passport = require('passport');
var StormpathStrategy = require("passport-stormpath");
var session = require("express-session");
var flash = require("connect-flash");


var index_routes = require('./routes/index');
var auth_routes = require('./routes/auth');
var books = require('./routes/books');

var app = express();

var strategy = new StormpathStrategy();
passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);


 // '~/.stormpath/apiKey.properties'
 // 'https://api.stormpath.com/v1/applications/3L6XnII2vzb7iwBRzwOxtI'
  


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// initialises sessions
app.use(session({
  secret: "process.env.theres_gay_aardvarks_in_lancaster_ohio",
  key: 'sid',
  cookie: {secure: false},
  resave: true,
  saveUninitialized: true,
  secret: 'icecream_genitals_sounds_like_a_cool_name'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', index_routes);
app.use('/', auth_routes);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
