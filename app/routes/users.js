'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var Recipe = traceur.require(__dirname + '/../models/recipe.js');
var BrewMethod = traceur.require(__dirname + '/../models/brewMethod.js');
var User = traceur.require(__dirname + '/../models/user.js');

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
  var userId = req.user._id;
  User.findById(userId, (err, user)=>{
    var recipes = user.recipeLibrary;
    res.render('users/recipeLibrary', {recipes:recipes, user: req.user, title: 'Recipe Library'});
  });
};

exports.addToLibrary = (req, res)=>{
  console.log('==== made it inside route to add to lib ====');
  var userId = req.user._id;
  var recipeId = req.body.recipeId;

  User.findById(userId, (err, user)=>{
    // console.log('==== user we found ====');
    // console.log(user);
    Recipe.findById(recipeId, (err, recipe)=>{
      console.log('==== recipe we found ====');
      console.log(recipe);
      var brewMethodId = recipe.brewMethodId;
      BrewMethod.findById(brewMethodId, (err, brewMethod)=>{
        var brewMethodName = brewMethod.name;
        var recipeTitle = recipe.title;
        user.addToLibrary(recipeId, recipeTitle, brewMethodId, brewMethodName, recipe=>{
          console.log('==== recipe we are sending to jade ====');
          console.log(recipe);
          user.save(()=>{
            res.render('recipes/added');
          });
        });
      });
    });
  });
};

exports.toggleFavorite = (req, res)=>{
  var recipeId = req.body.recipeId;
  var userId = req.user._id;
  User.findById(userId, (err, user)=>{
    user.toggleFavorite(recipeId, recipes=>{
      res.render('users/favorites', {recipes:recipes, user: req.user});
    });
  });
};
