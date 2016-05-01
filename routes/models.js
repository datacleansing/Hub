var express = require('express');
var router = express.Router();
var request = require('request');

MODEL_TOKEN="/:modelId"

function getRepoModelsURL(req){
  return dchub.repo.baseUrl + "/" + req.repoId + URI_MODELS;
}

function getRepoModelURL(req){
  return getRepoModelsURL(req) + "/" + req.params.modelId;
}

function getRepoModelTagsURL(req){
  return getRepoModelURL(req) + "/" + URI_TAGS;
}

function getRepoModelTagURL(req){
  return getRepoModelTagsURL(req) + "/" + req.params.tagId;
}

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
        getRepoModelsURL(req),
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

router.all(MODEL_TOKEN + "*", function(req, res, next){
  request(getRepoModelURL(req), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      req.modelObj = JSON.parse(body);
      next();
    }else {
      res.sendStatus(404);
    }
  });
});

router.get(MODEL_TOKEN, function(req, res, next) {
  dchub.repoRender(req, res, 'model/modelDetailMeta',
  {
    "pageId": "MODEL_META",
    "model": req.modelObj
  });
});

router.get(MODEL_TOKEN + '/meta', function(req, res, next) {
  dchub.repoRender(req, res, 'model/modelMetadataEditor',
  {
    "pageId": "MODEL_META",
    "model": req.modelObj
  });
});

router.get(MODEL_TOKEN + URI_TAGS , function(req, res, next) {
  request(getRepoModelTagsURL(req), function (error, response, body) {
    var items = [];
    if (!error && response.statusCode == 200) {
      items = JSON.parse(body).items;
    }
    console.log(items);
    dchub.repoRender(req, res, 'model/modelTags', {
      "pageId": "MODEL_TAG",
      "model": req.modelObj,
      "items": items
    });
  });
});

router.all(MODEL_TOKEN + URI_TAGS + TAG_TOKEN + "*", function(req, res, next) {
  request(getRepoModelTagURL(req), function (error, response, body) {
    var tag = null;
    if (!error && response.statusCode == 200) {
      tag = JSON.parse(body);
    }else{
      tag = {
        "resourceId": req.modelObj.id,
        "id": req.params.tagId,
        "dataUri": ""
      };
    }
    req.tagObj = tag;
    next();
  });
});

router.get(MODEL_TOKEN + URI_TAGS + TAG_TOKEN, function(req, res, next) {
  dchub.repoRender(req, res, 'model/modelTagDetails', {
    "pageId": "TAG_META",
    "model": req.modelObj,
    "tag": req.tagObj
  });
});

router.get(MODEL_TOKEN + URI_TAGS + TAG_TOKEN + "/data", function(req, res, next) {
  dchub.repoRender(req, res, 'model/modelTagDataInfo', {
    "pageId": "TAG_DATA",
    "model": req.modelObj,
    "tag": req.tagObj
  });
});

router.get(MODEL_TOKEN + URI_TAGS + TAG_TOKEN + "/usage", function(req, res, next) {
  dchub.repoRender(req, res, 'model/modelTagUsage', {
    "pageId": "TAG_USAGE",
    "model": req.modelObj,
    "tag": req.tagObj
  });
});

router.get(MODEL_TOKEN + URI_TAGS + TAG_TOKEN + "/uploader", function(req, res, next) {
  var tagUrl = URL_HUB + URI_REPO + req.repoId + URI_MODELS + "/" + req.modelObj.id + URI_TAGS + "/" + req.tagObj.id;
  dchub.repoRender(req, res, 'model/modelTagDataUploader', {
    "model": req.modelObj,
    "tag": req.tagObj,
    "uploader_url": URL_UPLOADER,
    "tag_url": tagUrl,
    "success_url" : tagUrl + "/data"
  });
});

router.put(MODEL_TOKEN + URI_TAGS + TAG_TOKEN, function(req, res, next) {
  request.put(
    getRepoModelTagURL(req) + "",
    {
      "body": req.body.uri
    },
    function (error, response, body) {
      if (!error && response.statusCode == 201) {
        res.sendStatus(204);
      }else {
        res.sendStatus(500);
      }
    });
});

module.exports = router;
