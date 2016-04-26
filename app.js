var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var stylus = require('stylus');
var nib = require('nib');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
var GitHubStrategy = require('passport-github2').Strategy;

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


function handleToken(token, tokenSecret, profile, done, domain) {
  var account = {
    "domain": domain,
    "uid": profile.id,
    "displayName": profile.displayName || profile.username,
    "tokens": [
      {
        "kind": 'oauth',
        "token": token,
        "attributes": {
          "tokenSecret": tokenSecret
        }
      }]
  };
  return done(null, account);
};

function handleGoogleToken(token, tokenSecret, profile, done){
  return handleToken(token, tokenSecret, profile, done, "google.com");
}

function handleGitHubToken(token, tokenSecret, profile, done){
  return handleToken(token, tokenSecret, profile, done, "github.com");
}

passport.use(new GoogleStrategy({
    consumerKey: process.env.GOOGLE_CONSUMER_KEY || "",
    consumerSecret: process.env.GOOGLE_CONSUMER_SECRET || "",
    callbackURL: "/auth/google/callback"
  },
  handleGoogleToken
));

passport.use(new GitHubStrategy({
    "clientID": process.env.GITHUB_CLIENT_ID || "",
    "clientSecret": process.env.GITHUB_CLIENT_SECRET || "",
    "callbackURL": "/auth/github/callback"
  },
  handleGitHubToken
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '12345',
  name: 'datacleansing_logon',
  cookie: {maxAge: 30*60*1000 },
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


function handleAuthCallback(req, res){
    res.redirect('/ui/');
};

app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));
app.get('/auth/google/callback',
  passport.authenticate('google'),
  handleAuthCallback);

app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/ui/'}));
app.get('/auth/github/callback',
  passport.authenticate('github'),
  handleAuthCallback);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.get('/login', function(req, res, next) {
  res.render('login');
});

app.use(function(req, res, next) {
  if(req.isAuthenticated()){
    res.header('Access-Control-Allow-Origin',  '*');
    res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  }else{
    res.render("403");
  }
});
app.get('/ui/', function(req, res, next) {
res.render('dashboard', {
  "user": req.user
});
});
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
