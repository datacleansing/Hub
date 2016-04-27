var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
    var algorithms = [];
    request(dchub.engine.algorithmsUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        algorithms = JSON.parse(body).items
      }else {
        console.log("Failed to fetch algorithms list for " + JSON.stringify(error));
      }
      dchub.render(req, res, 'algorithm/algorithms', { "algorithms": algorithms});
    });
});


router.get('/:key', function(req, res, next) {
});

module.exports = router;
