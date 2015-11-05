var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var expresslogger = require('morgan');

var logger=('/routes/utils/logger');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var RedisStore = require('connect-redis')(session);

var routes = require('./routes/index');
var users = require('./routes/users');
//var login = require('./routes/login');
var api = require('./routes/api');
// var details = require('./routes/details');
// var graph = require('./routes/graph');
// var cmdb = require('./routes/cmdb');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(expresslogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static( path.join(__dirname, '/bower_components')));
app.use('/client',  express.static( path.join(__dirname, '/client')));

app.use(session({
  secret: 'TSOKey',
  resave: true,
  saveUninitialized: true
}));

app.use('/', routes);
app.use('/users', users);
//app.use('/login', login);
app.use('/api', api);

app.get('/partials/:name', function (req, res)
{ var name = req.params.name;
  res.render('partials/' + name);
});

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


module.exports =  app;

