'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var Recipe = traceur.require(__dirname + '/../models/recipe.js');
//var User = traceur.require(__dirname + '/../models/user.js');

// exports.login = (req, res)=>{
//   res.render('users/login', {message: req.flash('loginMessage'), title: 'Login'});
// };
//
// exports.signup = (req, res)=>{
//   res.render('users/signup', {message: req.flash('registerMessage'), title: 'Register'});
// };

exports.profile = (req, res)=>{
  var id = req.user._id;
  // console.log('==== USER ID FROM REQ.USER ====');
  // console.log(id);
  Recipe.findByCreator(id, recipes=>{
    // console.log('==== RECIPES THE USER HAS ====');
    // console.log(recipes);
    res.render('users/profile', {user: req.user, recipes: recipes, title: 'Profile'});
  });
};

exports.edit = (req, res)=>{
  res.render('users/edit', {user: req.user, title: 'Profile'});
};

exports.update = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var user = req.user;
    // console.log('=== FIELDS ===');
    // console.log(fields);
    // console.log('=== FILES ===');
    // console.log(files);
    user.edit(fields, files, user=>{
      // console.log('=== user we are getting back');
      // console.log(user);
      user.save(()=>{
        res.redirect('/profile');
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
