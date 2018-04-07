var express = require('express');
var router = express.Router();

var findDocuments = function(db, callback) {
  // Get the documents collection
  db.collection('documents').find({}).toArray(function(err, docs) {
    callback(docs);
  });
};

/* GET home page. */
router.get('/data', function(req, res, next) {
   req.db.collection('documents').find({}).toArray(function(err, quotes) {
      res.render('index', { title: 'Express', quotes: quotes });
   });
});

/* POST to write a quote */
router.post('/data', function(req, res, next) {
   req.db.collection('documents').insert(req.body);
   res.redirect('/data');
});

/* GET to delete */
router.get('/data/delete/:id', function(req, res, next) {
   req.db.collection('documents').remove({"_id": req.ObjectId(req.params.id)});
   res.redirect('/data');
});


module.exports = router;
