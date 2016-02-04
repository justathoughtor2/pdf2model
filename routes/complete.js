var express = require('express');
var router = express.Router();

// GET complete.jade
/* GET home page. */
router.get('/complete', function(req, res, next) {
  res.render('complete', { title: 'pdf2model', links: ['http://pdf2model.com/'] });
});

module.exports = router;