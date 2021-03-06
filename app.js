require("dotenv").config();
require("./configs/dbconfig"); 
require("./helpers/hbs");

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const MongoStore = require("connect-mongo").default;
const logger = require('morgan');
const flash = require('connect-flash');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//session set up
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 100000000000 }, // in millisec   1 hour = 3600000 ms
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    saveUninitialized: false,
    resave: false,
  })
);

app.use(flash());

app.use(require("./middlewares/exposeFlashMessage"));
app.use(require("./middlewares/exposeDoctorLoginStatus"));
app.use(require("./middlewares/exposePatientLoginStatus"));

const indexRouter = require('./routes/index');
const patientsRouter = require('./routes/patient-route');
const doctorsRouter = require('./routes/doctor-route');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/patient', patientsRouter);
app.use('/doctor', doctorsRouter);
app.use('/auth', authRouter);

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
