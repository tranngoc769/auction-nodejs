'use strict';
var debug = require('debug');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//const home = require('./routes/index');
//const users = require('./routes/users');
const middleware = require('./app/middleware/security');
const auth = require('./app/utils/auth');
var app = express();
const exphbs = require('express-handlebars');
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');
const hbs = exphbs.create({ /*config */
    extname: 'hbs',
    defaultLayout: 'layout'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(async function(req, res, next) {
    if (typeof req.cookies.jwt == "string") {
        const data = await auth.verifyToken(req.cookies.jwt)
        res.locals.fullName = data.fullName;
        res.locals.isLogin = true;
        res.locals.isAdmin = (data.roleName == "admin") ? true : false;
        res.locals.isSeller = (data.roleName == "seller") ? true : false;
        res.locals.isBidder = (data.roleName == "bidder") ? true : false;
    }
    //res.clearCookie("jwt");
    next();

})

app.use('/', require('./app/home/controller/home'));
app.use('/user', require('./app/home/controller/account'));
app.use('/admin', middleware.isAdmin, require('./app/areas/admin/controller/admin'));
app.use('/seller', middleware.isSeller, require('./app/areas/seller/controller/seller'));
//app.use('/users', users);

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

app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});