var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/data', function(req, res) {
  req.db.collection('documents').find({}).toArray(function(err, quotes) {
    res.render('index', { title: 'Express', quotes: quotes });
  });
});

/* POST to write a quote */
router.post('/data', function(req, res) {
  req.db.collection('documents').insert(req.body);
  res.redirect('/data');
});

/* GET to delete */
router.get('/data/delete/:id', function(req, res) {
  req.db.collection('documents').remove({'_id': req.ObjectId(req.params.id)});
  res.redirect('/data');
  console.log('test');
});

module.exports = router;
