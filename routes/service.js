var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
    var services = [];
    request(dchub.servicesProxy.servicesUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        services = JSON.parse(body).items
      }else {
        console.log("Failed to fetch services list for " + JSON.stringify(error));
      }
      dchub.render(req, res, 'service/services', { "services": services});
    });
});


router.get('/:key', function(req, res, next) {
});

module.exports = router;
