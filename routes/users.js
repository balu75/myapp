var express = require('express');
var router = express.Router();
var util = require('util');
var bcrypt = require('bcrypt');
var path = require('path');

function showUsers(req, res, user, errors) {
   req.db.collection('users').find({}).toArray(function(err, users) {
      res.render('users/list', { title: 'Benutzer', users: users, user: user, errors: errors});
   });
}

/* GET Users page. */
router.get('/', function(req, res, next) {
   showUsers(req, res, {
      firstname: "",
      lastname: "",
      email: ""});
});

/* POST Users page. */
router.post('/', function(req, res, next) {
   var user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
   };

   var errors = [];

   if (req.body.password != req.body.password_validation) {
      errors.push('Das Passwort wurde nicht korrekt 2x eingegeben');
   }

   if (req.body.password.length == 0) {
      errors.push('Das Passwort ist leer');
   }

   if (user.firstname.length == 0) {
      errors.push('Der Vorname ist leer');
   }

   if (user.lastname.length == 0) {
      errors.push('Der Nachname ist leer');
   }

   if (user.email.length == 0) {
      errors.push('Die Email Adresse ist leer');
   }

   if (errors.length > 0) {
      showUsers(req, res, user, errors);
   }
   else {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
         user.password = hash;
         req.db.collection('users').insert(user);
         res.redirect('/users');
      });
   }
});

/* DELETE Users page. */
router.get('/delete/:id', function(req, res, next) {
   req.db.collection('users').remove({"_id": req.ObjectId(req.params.id)});
   res.redirect('/users');
});


module.exports = router;
