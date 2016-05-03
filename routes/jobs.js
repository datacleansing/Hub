var express = require('express');
var router = express.Router();
var request = require('request');

JOB_TOKEN="/:joblId"


router.get('', function(req, res, next) {
  var models = [];
  request(getRepoModelsURL(req), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      models = JSON.parse(body).items
    }else {
      console.log("Failed to fetch job list for " + JSON.stringify(error));
    }
    dchub.repoRender(req, res, 'model/models', { "models": models});
  });
});


module.exports = router;
