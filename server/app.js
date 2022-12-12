var createError = require('http-errors');
var express = require('express');
var path = require('path');

var multer  = require('multer')
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var propertiesRouter=require('./routes/properties')
var reservationRouter=require('./routes/reservation')
var favouriteRouter=require('./routes/favourites')
var app = express();
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.append('Access-Control-Allow-Headers', 'Content-Type, authorization');
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/properties',propertiesRouter)
app.use('/reservations',reservationRouter)
app.use('/favourites',favouriteRouter)
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
