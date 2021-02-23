var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const session = require("express-session") 
// module to create session middleware
// Session is a storage that consists of information on server-side
// Session will disappear when user closes the browser
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log("MONGO DB CONNECTED");
  })
  .catch((e) => {
    console.log(e);
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET, // key to encrypt
  resave: false, // setting that always save session. false => do not save sessions always 
  saveUninitialized: false, // Uninitialize session before save. false => do not Uninitialize
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    mongooseConnection: mongoose.connection,
    autoReconnect: true,
  }),
  cookie: { maxAge: 60 * 60 * 1000}, //session cookie setting. cookie will last for one hour 
}))

app.use((req, res, next) => {
  res.locals.error = null;
  res.locals.success = null;
  res.locals.user = null;
  res.locals.data = null;

  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
