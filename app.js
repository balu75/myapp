var createError = require('http-errors');
var express = require('express');
var formidable = require('formidable');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var imagesRouter = require('./routes/images');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var cookieSession = require('cookie-session');
var lessMiddleware = require('less-middleware');

var url = 'mongodb://localhost:27017/';

var app = express();

app.use(function (req, res, next) {
  var form = new formidable.IncomingForm({
    encoding: 'utf-8',
    uploadDir: path.join(__dirname, 'public/images/uploads'),
    multiples: true,
    keepExtensions: true
  });
  form.once('error', console.log);
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log('The form produced an error');
    }
    req.body = fields;
    req.files = files;
    next();
  });
});

var db;
MongoClient.connect(url, function (err, client) {
  if (err) return console.error(err);
  db = client.db('myproject');
});

app.use(function (req, res, next) {
  req.db = db;
  req.ObjectId = ObjectId;
  next();
});

app.use(cookieSession({
  name: 'session',
  secret: 'Quaiqu4Un2cied8Haeh8hohge'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.basedir = __dirname;

app.use(logger('dev'));
app.use(cookieParser());

app.use(lessMiddleware(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
  if (req.path === '/login/login') {
    next();
  } else if (typeof (req.session.user) === 'undefined') {
    res.redirect('/login/login');
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/img', imagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
