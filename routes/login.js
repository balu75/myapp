var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

/* Show Login Page */
router.get('/login', function(req, res) {
  res.render('login/login', {hide_logout: true});
});

/* Handle the login request */
router.post('/login', function(req, res) {
  var email = req.body.email;

  req.db.collection('users').findOne({ email: email }, function(err, result) {

    var errors = [];
    if (err) {
      errors.push( 'Es ist ein allgemeiner Fehler aufgetreten' );
      res.render('login/login', {errors: errors});
    }
    if (!result) {
      errors.push( 'Der Benutzer konnte nicht gefunden werden' );
      res.render('login/login', {errors: errors});
    } else {
      bcrypt.compare(req.body.password, result.password, function(err, result) {
        if (result) {
          req.session.user = result;
          res.redirect('/users');
        } else {
          var errors = ['Das Passwort stimmte nicht überein'];
          res.render('login/login', {errors: errors});
        }
      });
    }
  });
});

/* Handle the logout request */
router.get('/logout', function(req, res) {
  req.session.user = undefined;
  res.redirect('/login/login');
});

module.exports = router;
