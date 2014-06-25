'use strict';

var traceur = require('traceur');
var BrewMethod = traceur.require(__dirname + '/../models/brewmethod.js');
var User = traceur.require(__dirname + '/../models/user.js');
var Recipe = traceur.require(__dirname + '/../models/recipe.js');

exports.index = (req, res)=>{
  BrewMethod.findAll(brewMethods=>{
    res.render('brew/index', {user: req.user, brewMethods:brewMethods, title: 'Profile'});
  });
};

exports.filterLibrary = (req, res)=>{
  var userId = req.user._id;
  var brewMethodId = req.query.brewMethodId;
  // console.log('==== the brew ID we are sending over from query ====');
  //console.log(brewMethodId);
  //var noRecipes = `<p>You have not added any recipes for that brew method yet</p><a href='/recipes' class='button button-rounded button-flat-highlight'>Browse Recipes</a>`;


  User.findById(userId, (err, user)=>{
    user.showLibraryByBrewMethod(brewMethodId, recipes=>{
      res.render('brew/filteredLibrary', {recipes:recipes});

      // if(recipes){
      //   console.log('sending back recipes!!');
      //   res.send('brew/filteredLibrary', {recipes:recipes});
      // }else{
      //   console.log('NULL - sending back p tag and button to append.');
      //   res.send('brew/filteredLibrary', {recipes:noRecipes});
      // }
    });
  });
};

exports.prep = (req, res)=>{
  //console.log('==== looking for prep ======');
  var recipeId = req.query.selectedRecipeId;
  // console.log('==== recipe we want to make ======');
  // console.log(recipeId);

  Recipe.findById(recipeId, (err, recipe)=>{
    // console.log('==== recipe obj we want to load prep for ======');
    // console.log(recipe);
    var preps = recipe.prep;
    res.render('brew/prep', {recipe:recipe, preps:preps});
  });
};
