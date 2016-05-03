var express = require('express');
var router = express.Router();
var request = require('request');

router.get('', function(req, res, next) {
    var services = [];
    request(URL_SERVICES + "/" + req.repoId, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        services = JSON.parse(body).items
      }else {
        console.log("Failed to fetch services list for " + JSON.stringify(response));
      }
      dchub.repoRender(req, res, 'service/services', { "services": services});
    });
});

router.all("/:svcId*", function(req, res, next) {
    var service = {};
    request(URL_SERVICES + "/" + req.repoId + "/" + req.params.svcId, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        service = JSON.parse(body);
        req.svc = service;
        next();
      }else {
        console.log("Failed to fetch services for " + JSON.stringify(response));
        res.sendStatus(404)
      }
    });
});

router.get("/:svcId", function(req, res, next) {
  dchub.repoRender(req, res, 'service/serviceDetail', {
    "viewId": "SVC_META",
    "service": req.svc
  });
});

router.get("/:svcId/api", function(req, res, next) {
  dchub.repoRender(req, res, 'service/serviceAPI', {
    "viewId": "SVC_API",
    "service": req.svc,
    "api_url": URL_SERVICES + "/" + req.repoId + "/" + req.svc.id + "/api"
  });
});

module.exports = router;
