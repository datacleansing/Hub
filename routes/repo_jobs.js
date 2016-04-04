var express = require('express');
var router = express.Router();
var request = require('request');

/* GET job listing. */
router.get('', function(req, res, next) {
  request('http://localhost:12616/repo/jobs', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('job/jobs', { title: 'My Jobs', items: JSON.parse(body)});
    }
    else {
      console.log("Failed to fetch job list for " + JSON.stringify(error));
      next();
    }
  });
});

/* GET job Metadata */
router.get('/:key', function(req, res, next) {
  res.render('job/jobDetail', { title: 'Details', jobKey: req.params.key });
});

/* GET job Metadata */
router.get('/:key/meta', function(req, res, next) {
  var isNew = req.params.key == "new";
  res.render(
    'job/jobMetadataEditor',
    {
      title: isNew ? 'Create New Job' : 'Edit Metadata',
      jobKey: req.params.key,
      data:
          {
              "name" : "Summer"
          }
    });
});

/* GET job Metadata */
router.get('/:key/editor', function(req, res, next) {
  res.render('job/jobEditor', {
    title: 'Designer',
    jobKey: req.params.key,
    data:
        {
            "name" : "Summer"
        }
    });
});

router.get('/:key/archives', function(req, res, next) {
  request('http://localhost:12616/repo/models', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('job/jobArchives', { title: 'Archives', items: JSON.parse(body)});
    }else {
      next();
    }
  });
});

module.exports = router;
