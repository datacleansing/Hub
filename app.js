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
var GitHubStrategy = require('passport-github').Strategy;

var index = require('./routes/index');
var explorer = require('./routes/explorer');
var models = require('./routes/models');
var services = require('./routes/service');
var algorithms = require('./routes/algorithm');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
dchub = {};
dchub.repo = {};
dchub.repo.baseUrl = process.env.DMCLOUD_REPO_URL || "http://127.0.0.1:12616/";
dchub.repo.modelUrl = dchub.repo.baseUrl + "models";
dchub.engine = {};
dchub.engine.baseUrl = process.env.DMCLOUD_ENGINE_URL || "http://127.0.0.1:12617/";
dchub.engine.algorithmsUrl = dchub.engine.baseUrl + "algrithms";
dchub.servicesProxy = {};
dchub.servicesProxy.baseUrl = process.env.DMCLOUD_SERVICEPROXY_URL || "http://127.0.0.1:12618/";
dchub.servicesProxy.servicesUrl = dchub.servicesProxy.baseUrl + "services";

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
    consumerKey: process.env.GOOGLE_CONSUMER_KEY || "GOOGLE_CONSUMER_KEY",
    consumerSecret: process.env.GOOGLE_CONSUMER_SECRET || "GOOGLE_CONSUMER_SECRET",
    callbackURL: "/auth/google/callback"
  },
  handleGoogleToken
));

passport.use(new GitHubStrategy({
    "clientID": process.env.GITHUB_CLIENT_ID || "GITHUB_CLIENT_ID",
    "clientSecret": process.env.GITHUB_CLIENT_SECRET || "GITHUB_CLIENT_SECRET",
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
app.use(express.static(path.join(__dirname, 'public')));

dchub.render = function(req, res, view, load){
  var data = {
    "view": view,
    "user": req.user
  }
  if(load){
    for (var key in load) {
      data[key] = load[key];
    }
  }
  res.render(view, data)
}
app.use(function(req, res, next) {

  if(process.env.DCH_DEBUG === "1"){
      req.login({
        "domain": "system",
        "uid": "system_user",
        "displayName": "System User",
        "tokens": [
          {
            "kind": 'oauth',
            "token": "token",
            "attributes": {
              "tokenSecret": "tokenSecret"
            }
          }]
      }, function(req, res){
        next();
      });
  }
});

app.use('/', index);
app.use('/ui/algorithms', algorithms);
app.use('/ui/services', services);
app.use('/ui/explorer', explorer);

app.use(function(req, res, next) {
  if(req.isAuthenticated()){
    next();
  }else{
    res.render("403");
  }
});
app.get('/ui/', function(req, res, next) {
  dchub.render(req, res, 'dashboard');
});
app.use('/ui/models', models);

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
