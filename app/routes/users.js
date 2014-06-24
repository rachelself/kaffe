'use strict';

// exports.login = (req, res)=>{
//   res.render('users/login', {message: req.flash('loginMessage'), title: 'Login'});
// };
//
// exports.signup = (req, res)=>{
//   res.render('users/signup', {message: req.flash('registerMessage'), title: 'Register'});
// };

var multiparty = require('multiparty');
//var traceur = require('traceur');
//var User = traceur.require(__dirname + '/../../app/models/user.js');
// var _ = require('lodash');

exports.profile = (req, res)=>{
  res.render('users/profile', {user: req.user, title: 'Profile'});
};

exports.edit = (req, res)=>{
  res.render('users/edit', {user: req.user, title: 'Profile'});
};

exports.update = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var user = req.user;
    // console.log('=== form we are parsing ===');
    // console.log(form);
    user.edit(fields, files, user=>{
      console.log('=== user we are getting back');
      console.log(user);
      user.save(()=>{
        res.redirect('/profile', {user: req.user, title: 'Profile'});
      });
    });
  });
};

exports.connectLocal = (req, res)=>{
  res.render('users/connectLocal', {message: req.flash('loginMessage'), title: 'Connect Local Account'});
};

exports.settings = (req, res)=>{
  res.render('users/settings', {user: req.user, title: 'Profile Settings'});
};

exports.recipeLibrary = (req, res)=>{
  res.render('users/recipeLibrary', {user: req.user, title: 'Recipe Library'});
};
