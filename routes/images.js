var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET Images */
router.get('/:id', function(req, res) {
  var img = fs.readFileSync(
    path.join(__dirname, '/../public/images/uploads', req.params.id));

  res.writeHead(200, {'Content-Type': 'image/jpeg' });
  res.end(img, 'binary');
});


module.exports = router;
