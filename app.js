var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var session = require('express-session');
var  mongoose = require('mongoose');
var dataModel = require('./models/mcp');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'catestroipicliean',
  resave: true,
  saveUninitialized: true,
  cookie:{maxAge:50000000}
  }));

 app.use(function(req, res, next){
     /*dataModel.menus.find( {language:'te'} ).populate({path:'catpag_id', select: 'category slug language'}).sort('priority').exec(function(err,menus){
        res.locals.menus = menus;
      });*/

    res.locals.session = req.session;

    next();
  });

//FrontEnd static files
app.use('/swaerotimes',express.static(path.join(__dirname, 'public')));
//Bankend static files
app.use('/mcp',express.static(path.join(__dirname, 'mcp_static')));


var site = require('./routes/site');
var api = require('./routes/api');
var mcp = require('./routes/mcp');

var categories = require('./routes/categories');
var district = require('./routes/district');
var mandal = require('./routes/mandal');
var users = require('./routes/users');
var pages = require('./routes/pages');
var posts = require('./routes/posts');
var subscribers = require('./routes/subscribers');
var menus = require('./routes/menus');
var media = require('./routes/media');
var login = require('./routes/login');
var ePaper = require('./routes/epaper');
var dashboard = require('./routes/dashboard');
var backup = require('./routes/mongodb_backup');


app.use('/api', api);
app.use('/mcp', mcp);
app.use('/', site);

app.use('/mcp', district);
app.use('/mcp', mandal);
app.use('/mcp', users);
app.use('/mcp', categories);
app.use('/mcp', posts);
app.use('/mcp', pages);
app.use('/mcp', subscribers);
app.use('/mcp', menus);
app.use('/mcp', media);
app.use('/mcp', login);
app.use('/mcp', dashboard);
app.use('/mcp', ePaper);
app.use('/mcp',backup);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render("error");
  res.render('mcp/404');
});


/* app.use(function (req, res) {
  res.redirect('/404');
}); */


module.exports = app;
