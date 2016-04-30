var express = require('express');
var router = express.Router();
var request = require('request');

function getRepoModelsURL(repoId){
  return dchub.repo.baseUrl + "/" + repoId + "/models";
}

function getRepoModelURL(repoId, modelId){
  return getRepoModelsURL(repoId) + "/" + modelId;
}

function getRepoModelTagsURL(repoId, modelId){
  return getRepoModelURL(repoId, modelId) + "/tags";
}

router.get('', function(req, res, next) {
  var models = [];
  request(getRepoModelsURL(req.repoId), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      models = JSON.parse(body).items
    }else {
      console.log("Failed to fetch job list for " + JSON.stringify(error));
    }
    dchub.repoRender(req, res, 'model/models', { "models": models});
  });
});

router.post('', function(req, res, next) {
  var newSource = req.body;
  if(newSource && newSource.id && newSource.id != ""){
      var model = {
        //"keywords": newSource.keywords,
        "isPrivate": newSource.isPrivate === "true",
        "description": newSource.description,
        "domain": newSource.domain,
        "datatype": newSource.datatype,
        "locale": newSource.locale || "Global",
        "id": newSource.id
      }
      request.post(
        getRepoModelsURL(req.repoId),
        {
          "json": true,
          "headers": {
              "content-type": "application/json",
          },
          "body": model
        },
        function (error, response, body) {
          if (!error && response.statusCode == 201) {
            var newModel = body;
            res.redirect(URI_REPO + req.repoId + URI_MODELS + "/" + newModel.id);
          }else {
            res.redirect(URI_REPO + req.repoId + URI_NEW_MODEL + "?code=" + response.statusCode);
          }
        });
  }else{
    res.redirect(URI_REPO + req.repoId + URI_NEW_MODEL + "?code=400")
  }
});

router.all("/:key*", function(req, res, next){
  request(getRepoModelURL(req.repoId, req.params.key), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      req.dataObj = JSON.parse(body);
      next();
    }else {
      res.sendStatus(404);
    }
  });
});

router.get('/:key', function(req, res, next) {
  dchub.repoRender(req, res, 'model/modelDetailMeta',
  {
    "pageId": "MODEL_META",
    "model": req.dataObj
  });
});

router.get('/:key/meta', function(req, res, next) {
  dchub.repoRender(req, res, 'model/modelMetadataEditor',
  {
    "pageId": "MODEL_META",
    "model": req.dataObj
  });
});

router.get('/:key/tags', function(req, res, next) {
  request(getRepoModelTagsURL(req.repoId, req.params.key), function (error, response, body) {
    var items = [];
    if (!error && response.statusCode == 200) {
      items = JSON.parse(body).items;
    }
    dchub.repoRender(req, res, 'model/modelTags', {
      "pageId": "MODEL_TAG",
      "model": req.dataObj,
      "items": items
    });
  });
});

module.exports = router;
