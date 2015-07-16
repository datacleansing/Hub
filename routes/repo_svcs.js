var express = require('express');
var router = express.Router();
var request = require('request');

/* GET svc listing. */
router.get('', function(req, res, next) {

  request('http://localhost:12616/repo/svcs', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.render('repo/svcs', { title: 'My Services', items: JSON.parse(body)});
    }
    else {
      next();
    }
  });
});

/* GET svc Metadata */
router.get('/summary/:key', function(req, res, next) {
  res.render('repo/svcDetail', { title: 'Details', svcKey: req.params.key });
});

/* GET svc Metadata */
router.get('/meta/:key', function(req, res, next) {
  var isNew = req.params.key == "new";
  res.render(
    'repo/svcMetadataEditor',
    {
      title: isNew ? 'Create New Service' : 'Edit Metadata',
      svcKey: req.params.key
    });
});


/* GET svc Metadata */
router.get('/designer/:key', function(req, res, next) {
  res.render('repo/processersEditor', { title: 'Designer', svcKey: req.params.key });
});

module.exports = router;
