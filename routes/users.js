var express = require('express');
var router = express.Router();
var util = require('util');
var bcrypt = require('bcrypt');

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
      firstname: req.fields.firstname,
      lastname: req.fields.lastname,
      email: req.fields.email,
   };

   var errors = [];

   if (req.fields.password != req.fields.password_validation) {
      errors.push('Das Passwort wurde nicht korrekt 2x eingegeben');
   }

   if (req.fields.password.length == 0) {
      errors.push('Das Passwort ist leer')
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
   
   //console.log("filepath: " + req.files[0].path);
   console.log(util.inspect(req.files));
   console.log(req.files.picture.path);


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
