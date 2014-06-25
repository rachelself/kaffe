/* jshint unused:false */

'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var BrewMethod = traceur.require(__dirname + '/../models/brewmethod.js');
var Recipe = traceur.require(__dirname + '/../models/recipe.js');

exports.index = (req, res)=>{
  Recipe.findAll(recipes=>{
    //console.log('===== RECIPES ====');
    //console.log(recipes);
    BrewMethod.findAll(brewMethods=>{
      //console.log('===== BREW METHODS ====');
      //console.log(brewMethods);
      res.render('recipes/index', {user: req.user, recipes: recipes, brewMethods: brewMethods, title: 'Recipes'});
    });
  });
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
    res.redirect(`/recipes/add/${id}`);
  });
};

exports.add = (req, res)=>{
  var recipeId = req.params.id;
  Recipe.findById(recipeId, recipe=>{
    res.render('recipes/add', {recipe: recipe, recipeId: recipeId, user: req.user});
  });
};

exports.update = (req, res)=>{
  //console.log('===== made to update function ====');
  var recipeId = req.params.id;
  var form = new multiparty.Form();

  Recipe.findById(recipeId, (err, recipe)=>{
    form.parse(req, (err, fields, files)=>{
      // console.log('=== FIELDS ===');
      // console.log(fields);
      // console.log('=== FILES ===');
      // console.log(files);
      // console.log('===== recipe we are going to update ====');
      // console.log(recipe);
      recipe.addInstructions(fields, files, recipe=>{
        // console.log('=== recipe we have saved ===');
        // console.log(recipe);
        recipe.save(()=>{
          res.redirect('/profile');
        });
      });
    });
  });
};

exports.show = (req, res)=>{
  var recipeId = req.params.id;
  Recipe.findById(recipeId, (err, recipe)=>{
    var brewMethodId = recipe.brewMethodId;
    BrewMethod.findById(brewMethodId, (err, brewMethod)=>{
      res.render('recipes/show', {recipe: recipe, brewMethod: brewMethod, user: req.user});
    });
  });
};

exports.filter = (req, res)=>{
  console.log('===== made it to filter route ====');
  var brewMethodId = req.params.id;

  if(brewMethodId === 'none'){
    // console.log('===== redirecting... ====');
    // res.redirect('/recipes');
    Recipe.findAll(recipes=>{
      // console.log('===== finding ALL RECIPES ====');
    //  console.log(recipes);
      res.render('recipes/filter', {recipes:recipes});
    });
  }else{
    Recipe.findByBrewMethod(brewMethodId, recipes=>{
      // console.log('===== RECIPES ====');
      // console.log(recipes);
      res.render('recipes/filter', {recipes:recipes});
    });
  }
};
