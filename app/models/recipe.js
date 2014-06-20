/* jshint unused:false */

'use strict';

var recipes = global.nss.db.collection('recipes');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
// var mkdirp = require('mkdirp');
// var fs = require('fs');
// var bcrypt = require('bcrypt-nodejs');
// var _ = require('lodash');


class Recipe{



  save(fn){
    recipes.save(this, ()=>{
      fn();
    });
  }

  static findById(id, fn){
    Base.findById(id, recipes, Recipe, fn);
  }

  static findAll(fn){
    Base.findAll(recipes, Recipe, fn);
  }

  static create(userId, obj, fn){
    var recipe = new Recipe();
    recipe._id = Mongo.ObjectID(obj._id);
    recipe.userId = Mongo.ObjectID(userId);
    recipe.brewMethodId = Mongo.ObjectID(obj.brewMethodId);
    recipe.title = obj.title;
    recipe.description = obj.description;
    recipe.ratio = {};
    recipe.ratio.water = [];
    recipe.ratio.coffee = [];
    recipe.ratio.water.push(obj.waterAmnt, obj.waterUnit);
    recipe.ratio.coffee.push(obj.coffeeAmnt, obj.coffeeUnit);
    recipe.notes = obj.notes;
    recipe.grind = obj.grind;
    recipe.brewTime = obj.brewTime;
    recipe.instructions = [obj.instructions];
    recipe.prep = [obj.prep];
    // recipe.instructions.push({obj.instructions});
    // recipe.prep.push({obj.prep});
    // var instructions = obj.instructions.map(i=>{i.step:i.text, i.timer:i.time});
    // recipe.instructions = instructions;
    // var prep = obj.prep.map(p=>{p.step:p.text});
    // recipe.prep = prep;
    recipe.photos = [];
    recipe.vidoes = [];
    fn(recipe);
  }

}

module.exports = Recipe;
