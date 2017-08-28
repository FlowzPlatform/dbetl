var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');
var fs = require('fs');

var routes = require('./routes/index');
var schema = require('./routes/schema');
var authorization = require('./routes/authorization');
var flowInstance = require('./routes/flowInstance');
var api = require('./routes/api');
var settings = require('./routes/settings');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(session({ secret: 'ssshhhhh' }));
app.use(flash());

app.use(function(req, res, next) {
    //console.log(req);
    res.locals.session = req.session;
    next();
});


// Handle CORS
//app.use(function (req, res, next) {
//    res.setHeader('Access-Control-Allow-Origin', '*');
//    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
//    next();
//});

app.use('/', routes);
app.use('/schema', schema);
app.use('/auth', authorization)
app.use('/flowInstance', flowInstance)
app.use('/api', api)
app.use('/settings', settings)

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