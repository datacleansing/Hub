var express = require('express');
var router = express.Router();

router.get('/search', function(req, res, next) {
  dchub.render(req, res, 'explorer/search', {
    "search_key": req.query.searchField,
    "result": []
  });
});

module.exports = router;
