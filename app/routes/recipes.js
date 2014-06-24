/* jshint unused:false */

'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var BrewMethod = traceur.require(__dirname + '/../models/brewmethod.js');
var Recipe = traceur.require(__dirname + '/../models/recipe.js');

exports.index = (req, res)=>{
  res.render('recipes/index', {user: req.user, title: 'Recipes'});
};

exports.new = (req, res)=>{
  BrewMethod.findAll(brewMethods=>{
    // console.log('===== BREW METHODS ====');
    // console.log(brewMethods);
    res.render('recipes/new', {user: req.user, brewMethods: brewMethods, title: 'Recipes'});
  });
};

exports.create = (req, res)=>{
  var userId = req.user._id;

  Recipe.create(userId, req.body, recipe=>{
    var id = recipe._id.toString();
    console.log(recipe);
    res.redirect('/recipes/add');
  });
};

exports.addContent = (req, res)=>{
  var recipeId = req.params.id;
  Recipe.findById(recipeId, recipe=>{
    res.render('recipes/add', {recipe: recipe, recipeId: recipeId, user: req.user});
  });
};


// exports.create = (req, res)=>{
//   var id = req.user._id;
//
//   Recipe.create(id, req.body, recipe=>{
//     var brewMethodId = recipe.brewMethodId;
//
//     BrewMethod.findById(brewMethodId, (err, brewMethod)=>{
//       console.log('=== recipe we are getting back');
//       console.log(brewMethod);
//       var recipeId = recipe._id.toString();
//       var brewMethodName = brewMethod.name;
//       res.render('recipes/recipeInfo', {recipe:recipe, recipeId: recipeId, brewMethodName: brewMethodName});
//     });
//   });
// };
//
// exports.addContent = (req, res)=>{
//   var id = req.params.id;
//   var form = new multiparty.Form();
//
//   form.parse(req, (err, fields, files)=>{
//     console.log('=== FIELDS ===');
//     console.log(fields);
//     console.log('=== FILES ===');
//     console.log(files);
//     Recipe.findById(id, recipe=>{
//       recipe.addInstructions(fields, files, recipe=>{
//         recipe.save(()=>{
//           res.redirect('/profile');
//         });
//       });
//     });
//   });
// };


// exports.addInstructions = (req, res)=>{
//   console.log('=== made it inside the addInstructions route!');
//   var id = req.params.id;
//   Recipe.findById(id, recipe=>{
//     console.log('=== recipe we found');
//     console.log(recipe);
//     var brewMethodId = recipe.brewMethodId;
//     BrewMethod.findById(brewMethodId, brewMethod=>{
//       console.log('=== bm we found');
//       console.log(brewMethod);
//       res.render('recipes/addInstructions', {recipe:recipe, brewMethod: brewMethod, user:req.user, title: `Add Content to ${recipe.title}`});
//     });
//   });
// };
