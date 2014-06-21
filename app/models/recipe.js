/* jshint unused:false */

'use strict';

var recipes = global.nss.db.collection('recipes');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var fs = require('fs');
// var bcrypt = require('bcrypt-nodejs');
// var _ = require('lodash');


class Recipe{

  addInstructions(fields, files, fn){

    //--- RATIO ---
    this.ratio = {};
    this.ratio.water = [];
    this.ratio.water.push(fields.waterRatio[0] * 1);
    this.ratio.water.push(fields.waterRatio[1]);
    this.ratio.coffee = [];
    this.ratio.coffee.push(fields.coffeeRatio[0] * 1);
    this.ratio.coffee.push(fields.coffeeRatio[1]);


    //--- INSTRUCTIONS ---
    this.instructions = [];

    fields.instructions.forEach((obj, index)=>{
      var instructionStep = {};
      instructionStep.order = index;
      instructionStep.text = obj.step;

      var time = obj.timer.split(':').map(n=>n*1);
      var seconds;
      var minutes;
      var hours;
      var totalTime;

      if(time.length === 2){
        minutes = time[0];
        seconds = time[1];
        totalTime = (minutes * 60) + seconds;

      }else if(time.length === 3){
        hours = time[0];
        minutes = time[1];
        seconds = time[2];
        totalTime = (hours * 60 * 60) + (minutes * 60) + seconds;
      }

      instructionStep.timer = totalTime;
      this.instructions.push(instructionStep);
    });

    //--- PREP ---
    this.prep = [];

    fields.prep.forEach((obj, index)=>{
      var prepStep = {};
      prepStep.order = index;
      prepStep.text = obj.step;
      this.prep.push(prepStep);
    });


    //--- NOTES, BREWTIME, GRIND ---
    this.notes = fields.notes[0];
    this.brewTime = fields.brewTime[0];
    this.grind = fields.grind[0];

    //--- VIDEOS ---
    this.video = files.video[0];

    //--- PHOTOS ---
    this.photos = [];
    var path = files.photos[0].path;
    var fileName = files.photos[0].originalFilename;


    files.photos.forEach((p, i)=>{
      if(p.size === 0){fn(null); return;}

      var photo = {};
      photo.fileName = fileName;
      photo.path = `/img/recipeImages/${this._id}/${fileName}`;
      if(i){
        photo.isPrimary = false;
      }else{
        photo.isPrimary = true;
      }
      photo.caption = p.caption;
      this.photos.push(photo);

      mkdirp(`${__dirname}/../static/img/recipeImages/${this._id}`);
      fs.renameSync(path, `${__dirname}/../static/img/recipeImages/${this._id}/${fileName}`);
      fn(this);
    });
  }

  save(fn){
    recipes.save(this, ()=>{
      fn();
    });
  }

  static findByCreator(id, fn){
    recipes.find({userId:id}).toArray((e,recipes)=>{
      if(recipes.length === 0){
        fn(null);
      }else{
        recipes = recipes.map(r=>_.create(Recipe.prototype, r));
        fn(recipes);
      }
    });
  }

  static findByBrewMethod(id, fn){
    recipes.find({brewMethodId:id}).toArray((e,recipes)=>{
      if(recipes.length === 0){
        // var msg = 'No recipes were '
        fn(null);
      }else{
        recipes = recipes.map(r=>_.create(Recipe.prototype, r));
        fn(recipes);
      }
    });
  }

  static findById(id, fn){
    // console.log('==== made it inside find by ID =====');
    // console.log(id);
    Base.findById(id, recipes, Recipe, fn);
  }

  static findAll(fn){
    Base.findAll(recipes, Recipe, fn);
  }

  static create(obj, fn){
    recipes.findOne({title:obj.title[0]}, (err,r)=>{
      if(r){
        fn(null);
      }else{
        // console.log('==== made it inside recipe create method =====');

        var recipe = new Recipe();
        // console.log('==== made a new Recipe object =====');
        // var id = obj._id[0];
        // console.log(id);
        recipe._id = Mongo.ObjectID(obj._id);
        // console.log('==== gave it a Mongo ID =====');
        // console.log(recipe._id);
        recipe.userId = obj.userId;
      //  console.log('==== gave it a user ID =====');
        //console.log(recipe.userId);
        recipe.brewMethodId = obj.brewMethodId[0];
      //  console.log('==== gave it a brew method ID =====');
        //console.log(recipe.brewMethodId);
        recipe.title = obj.title[0];
        //console.log('==== gave it a title =====');
        //console.log(recipe.title);
        recipe.description = obj.description[0];
        //console.log('==== gave it a desc =====');
        //console.log(recipe.description);
        // recipe.ratio = {};
        // console.log(recipe.ratio);

        // recipe.ratio.water = [];
        // recipe.ratio.coffee = [];
        //recipe.ratio.water.push(obj.waterAmnt, obj.waterUnit);
        //recipe.ratio.coffee.push(obj.coffeeAmnt, obj.coffeeUnit);
        //recipe.notes = obj.notes[0];
        //console.log(recipe.notes);

        // recipe.grind = obj.grind[0];
        // console.log(recipe.grind);
        // recipe.brewTime = obj.brewTime[0];
        // console.log(recipe.brewTime);
        // recipe.instructions = [];
        // console.log(recipe.instructions);

        // recipe.prep = [obj.prep];

        // recipe.instructions.push({obj.instructions});
        // recipe.prep.push({obj.prep});
        // var instructions = obj.instructions.map(i=>{i.step:i.text, i.timer:i.time});
        // recipe.instructions = instructions;
        // var prep = obj.prep.map(p=>{p.step:p.text});
        // recipe.prep = prep;
        // var path = obj.photo[0]

        // recipe.photos = [];
        // console.log(recipe.photos);
        // recipe.videos = [];
        console.log('==== the new recipe!! =====');
        console.log(recipe);
        recipes.save(recipe, ()=>fn(recipe));
      }
    });
  }

}

module.exports = Recipe;
