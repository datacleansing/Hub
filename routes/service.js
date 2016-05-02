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



PUBLISH_TOKEN="/publish"
router.get(PUBLISH_TOKEN, function(req, res, next) {
  dchub.repoRender(req, res, 'service/serviceCreator', {
    "model": req.modelObj,
    "tag": req.tagObj,
    "publishUri": URI_SERVICES + PUBLISH_TOKEN
  });
});
router.post(PUBLISH_TOKEN, function(req, res, next) {
  var svcRequest = {
    jobUri: getRepoModelTagJobURL(req),
    metadata: req.body
  };
  request.post(
    getServicesURL(req),
    {
      "json": true,
      "headers": {
          "content-type": "application/json",
      },
      "body": svcRequest
    },
    function (error, response, body) {
      console.log(response);
      if (!error && response.statusCode == 201) {
        var newSvc = body;
        res.redirect(URI_SERVICES + req.repoId + "/" + newSvc.id);
      }else {
        res.redirect(URI_PUBLISH + "?code=" + response.statusCode);
      }
    });
});

module.exports = router;
