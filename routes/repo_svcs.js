var express = require('express');
var router = express.Router();
var request = require('request');

/* GET svc Metadata */
router.get('/:key', function(req, res, next) {
  res.render('repo_svcDetail', { title: 'Details' });
});

/* GET svc listing. */
router.get('', function(req, res, next) {

  request('http://localhost:12616/repo/svcs', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('repo_svcs', { title: 'My Services', items: JSON.parse(body)});
    }
    else {
      next();
    }
  });
});

module.exports = router;
