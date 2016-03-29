var express = require('express');
var router = express.Router();
var request = require('request');

/* GET job listing. */
router.get('', function(req, res, next) {

  request('http://localhost:12616/repo/jobs', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('repo/jobs', { title: 'My Jobs', items: JSON.parse(body)});
    }
    else {
      next();
    }
  });
});

/* GET job Metadata */
router.get('/summary/:key', function(req, res, next) {
  res.render('repo/jobDetail', { title: 'Details', jobKey: req.params.key });
});

/* GET job Metadata */
router.get('/meta/:key', function(req, res, next) {
  var isNew = req.params.key == "new";
  res.render(
    'repo/jobMetadataEditor',
    {
      title: isNew ? 'Create New Job' : 'Edit Metadata',
      jobKey: req.params.key
    });
});


/* GET job Metadata */
router.get('/designer/:key', function(req, res, next) {
  res.render('repo/jobsEditor', { title: 'Designer', jobKey: req.params.key });
});

module.exports = router;
