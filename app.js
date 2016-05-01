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

dchub = {};

URI_REPO = "/ui/repository/";
URI_ALGORITHMS = "/ui/algorithms/";
URI_SERVICES = "/ui/services/";
URI_EXPLORER = "/ui/explorer";
URI_MODELS = "/models";
URI_TAGS = "/tags";
URL_TAG_LATEST = URI_TAGS + "/latest";
URI_NEW_MODEL = "/newModel";
REPOID_TOKEN = ":repoId"
TAG_TOKEN="/:tagId"

URL_HUB = process.env.DMCLOUD_HUB_HOST || "http://127.0.0.1:8080/";
dchub.repo = {};
dchub.repo.baseUrl = process.env.DMCLOUD_REPO_HOST || "http://127.0.0.1:12616/";
dchub.repo.baseUrl = dchub.repo.baseUrl + "/repository"
dchub.fileuploader = {};
URL_UPLOADER = process.env.DMCLOUD_FILEUPLOADER_HOST || "http://127.0.0.1:12617/";
URL_UPLOADER = URL_UPLOADER + "/fileUploader"
dchub.engine = {};
dchub.engine.baseUrl = process.env.DMCLOUD_ENGINE_HOST || "http://127.0.0.1:12617/";
dchub.engine.algorithmsUrl = dchub.engine.baseUrl + "/algrithms";
dchub.servicesProxy = {};
dchub.servicesProxy.baseUrl = process.env.DMCLOUD_SERVICEPROXY_HOST || "http://127.0.0.1:12618/";
dchub.servicesProxy.servicesUrl = dchub.servicesProxy.baseUrl + "/services";

dchub.render = function(req, res, view, load){
  var data = {
    "URI_ALGORITHMS": URI_ALGORITHMS,
    "URI_SERVICES": URI_SERVICES,
    "URI_EXPLORER": URI_EXPLORER,
    "URI_MODELS": URI_MODELS,
    "URI_TAGS": URI_TAGS,
    "URL_TAG_LATEST": URL_TAG_LATEST,
    "URI_NEW_MODEL": URI_NEW_MODEL,
    "REPOID_TOKEN": REPOID_TOKEN,
    "user": req.user,
    "view": view
  }
  if(load){
    for (var key in load) {
      data[key] = load[key];
    }
  }
  res.render(view, data)
}

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


app.use(function(req, res, next) {
  //res.header('Access-Control-Allow-Origin',  '*');
  //res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');
  //res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
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

app.use(function(req, res, next) {

  if(process.env.DCH_DEBUG === "1"){
      req.login({
        "domain": "system",
        "uid": "datacleansing",
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
app.use(URI_ALGORITHMS, algorithms);
app.use(URI_SERVICES, services);
app.use(URI_EXPLORER, explorer);

app.use(function(req, res, next) {
  if(req.isAuthenticated()){
    next();
  }else{
    res.render("403");
  }
});

dchub.repoRender = function(req, res, view, load){
  var data = {
    "repoId": req.repoId
  }
  if(load){
    for (var key in load) {
      data[key] = load[key];
    }
  }
  dchub.render(req, res, view, data);
}
app.use(URI_REPO + REPOID_TOKEN + '*', function(req, res, next) {
  req.repoId = req.params.repoId;
  next();
});
app.get(URI_REPO + REPOID_TOKEN, function(req, res, next) {
  dchub.repoRender(req, res, 'dashboard');
});
app.use(URI_REPO + REPOID_TOKEN + URI_MODELS, models);
app.get(URI_REPO + REPOID_TOKEN + URI_NEW_MODEL, function(req, res, next) {
  dchub.repoRender(req, res, 'model/modelCreator', {
    "code": req.params ? req.params.code : null
  });
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


module.exports = app;
