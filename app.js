require("dotenv").config();
require("./configs/dbconfig"); 
//require("./helpers/hbs");

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require("connect-mongo")(session);
const logger = require('morgan');

app.use(logger("dev"));

const indexRouter = require('./routes/index');
const patientsRouter = require('./routes/patient-route');
const doctorsRouter = require('./routes/doctor-route');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(require("./middlewares/exposeFlashMessage"));
app.use(require("./middlewares/exposeDoctorLoginStatus"));
app.use(require("./middlewares/exposePatientLoginStatus"));

//session set up
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 }, // in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    saveUninitialized: true,
    resave: true,
  })
);

app.use('/', indexRouter);
app.use('/patient', patientsRouter);
app.use('/doctor', doctorsRouter);

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
