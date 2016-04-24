var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var stylus = require('stylus');
var nib = require('nib');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var WeiboStrategy = require('passport-weibo').Strategy;

var index = require('./routes/index');
var repo_jobs = require('./routes/repo_jobs');
var repo_models = require('./routes/repo_models');
var repo_archives = require('./routes/repo_archives');
var flow = require('./routes/flow');
var service = require('./routes/service');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
dmcloud = {};
dmcloud.repo = {};
dmcloud.repo.baseUrl = process.env.DMCLOUD_REPO_URL ? rocess.env.DMCLOUD_REPO_URL : "http://localhost:12616/repo/";
dmcloud.repo.modelUrl = dmcloud.repo.baseUrl + "models/"
dmcloud.repo.archiveUrl = dmcloud.repo.baseUrl + "archives"

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.post('/login', passport.authenticate('local',
  { successRedirect: '/ui/', failureRedirect: '/login' })
);

passport.use(new GoogleStrategy({
    consumerKey: GOOGLE_CONSUMER_KEY,
    consumerSecret: GOOGLE_CONSUMER_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve redirecting
//   the user to google.com.  After authorization, Google will redirect the user
//   back to this application at /auth/google/callback
app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

passport.use(new WeiboStrategy({
   clientID: WEIBO_CLIENT_ID,
   clientSecret: WEIBO_CLIENT_SECRET,
   callbackURL: "/auth/weibo/callback"
 },
 function(accessToken, refreshToken, profile, done) {
   User.findOrCreate({ weiboId: profile.id }, function (err, user) {
     return done(err, user);
   });
 }
));

app.use(function(req, res, next) {

  //to allow cross domain requests to send cookie information.
  //res.header('Access-Control-Allow-Credentials', true);

  // origin can not be '*' when crendentials are enabled. so need to set it to the request origin
  res.header('Access-Control-Allow-Origin',  '*');

  // list of methods that are supported by the server
  res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');

  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
});

app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/ui/jobs', repo_jobs);
app.use('/ui/models', repo_models);
app.use('/ui/archives', repo_archives);
app.use('/ui/flows', flow);
app.use('/ui/services', service);

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
