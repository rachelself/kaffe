/* jshint unused:false */

'use strict';

var recipes = global.nss.db.collection('recipes');
var ratings = global.nss.db.collection('ratings');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var fs = require('fs');
var _ = require('lodash');


class Recipe{

  // getRating(id, fn){
  //   ratings.findOne({recipeId:id}, (err, rating)=>{
  //     // rating = _.create(Rating.prototype, rating);
  //     fn(rating);
  //   });
  // }

  calculateByDrinkSize(drinkSize, unit, fn){

    var gramsInOz = 28.3495;
    var calculation = {};
    var waterToUse;
    var estimatedDrinkSize;
    var convertedW;
    var convertedC;
    var coffeeToUse;


    //-- UNITS ARE DIFFERENT --//
    if(unit !== this.ratio.unit){

      // console.log('the units are different');

      convertedW = this.ratio.water / gramsInOz;
      convertedC = this.ratio.coffee / gramsInOz;

      waterToUse = drinkSize;
      coffeeToUse = (waterToUse * convertedC) / convertedW;

      calculation.coffee = coffeeToUse.toFixed(2);
      calculation.unit = unit;
      calculation.water = waterToUse.toFixed(2);
      calculation.drinkSize = drinkSize;

      // console.log('=== calculation being sent back! ===');
      // console.log(calculation);

      fn(calculation);
      return;

    //-- UNITS ARE THE SAME --//
    }else{
      // console.log('the units are the same');

      waterToUse = drinkSize;
      coffeeToUse = (waterToUse * this.ratio.coffee) / this.ratio.water;

      calculation.coffee = coffeeToUse.toFixed(2);
      calculation.unit = unit;
      calculation.water = waterToUse.toFixed(2);
      calculation.drinkSize = drinkSize;

      fn(calculation);
      return;
    }
  }

  calculateByCoffeeAmount(coffeeToUse, unit, fn){
    // console.log('=== recipe ====');
    // console.log(this.ratio);
    var gramsInOz = 28.3495;
    var calculation = {};
    var waterToUse;
    var estimatedDrinkSize;
    var convertedW;
    var convertedC;
    coffeeToUse = coffeeToUse.toFixed(2);

    //-- UNITS ARE DIFFERENT --//
    if(unit !== this.ratio.unit){
      // console.log('units are not equal!');

      //-- GIVEN IN GRAMS --//

      if(unit === 'grams'){
        // console.log('units given in grams');
        convertedW = this.ratio.water * gramsInOz;
        convertedC = this.ratio.coffee * gramsInOz;

        waterToUse = ((coffeeToUse * convertedW) / convertedC).toFixed(2);
        estimatedDrinkSize = (waterToUse / gramsInOz).toFixed(2);

        calculation.coffee = coffeeToUse;
        calculation.unit = unit;
        calculation.water = waterToUse;
        calculation.drinkSize = estimatedDrinkSize;

        fn(calculation);
        return;

      }else{
        //-- GIVEN IN OZ --//

        // console.log('units given in oz');

        convertedW = this.ratio.water / gramsInOz;
        convertedC = this.ratio.coffee / gramsInOz;

        waterToUse = ((coffeeToUse * convertedW) / convertedC).toFixed(2);
        estimatedDrinkSize = waterToUse;

        calculation.coffee = coffeeToUse;
        calculation.unit = unit;
        calculation.water = waterToUse;
        calculation.drinkSize = estimatedDrinkSize;

        fn(calculation);
        return;
      }

      //-- UNITS ARE THE SAME --//
    }else{

      if(unit === 'grams'){
        //-- BOTH GRAMS --//
        // console.log('units are in grams');

        waterToUse = ((coffeeToUse * this.ratio.water) / this.ratio.coffee).toFixed(2);
        estimatedDrinkSize = (waterToUse / gramsInOz).toFixed(2);

        calculation.coffee = coffeeToUse;
        calculation.unit = unit;
        calculation.water = waterToUse;
        calculation.drinkSize = estimatedDrinkSize;

        fn(calculation);
        return;

      }else{
        //-- BOTH OZ --//
        // console.log('units are in oz');

        waterToUse = ((coffeeToUse * this.ratio.water) / this.ratio.coffee).toFixed(2);
        estimatedDrinkSize = waterToUse;

        calculation.coffee = coffeeToUse;
        calculation.unit = unit;
        calculation.water = waterToUse;
        calculation.drinkSize = estimatedDrinkSize;

        fn(calculation);
        return;
      }
    }
  }

  deletePhoto(userId, index, fn){

    //--- CHECK TO MAKE SURE USER IS OWNER --

    if(!(isOwner(userId, this.userId))){
      fn(null);
      return;
    }

    index = index * 1;

    //var dirContents = fs.readdirSync(`${__dirname}/../static/img/recipeImages/${this._id}`);

    var file = this.photos[index].fileName;

    // console.log('==== img path to remove =====');
    // console.log(file);
    fs.unlinkSync(`${__dirname}/../static/img/recipeImages/${this._id}/${file}`);

    var removed = _.remove(this.photos, function(p){ return p.order === index; });
    // console.log('==== removed! =====');
    // console.log(removed);

    function reOrder(photo, i){
        photo.order = i;
        return photo;
    }

    var newOrder = this.photos.map(reOrder);

    // console.log('==== newOrder! =====');
    // console.log(newOrder);

    fn(this);
  }

  addPhoto(userId, files, fn){

    //--- CHECK TO MAKE SURE USER IS OWNER --

    if(!(isOwner(userId, this.userId))){
      fn(null);
      return;
    }

    // does this recipe have an image directory?
    if(!fs.existsSync(`__dirname/../../../app/static/img/recipeImages/${this._id}`)){
      mkdirp(`${__dirname}/../static/img/recipeImages/${this._id}`);
    }

    // how many images are there already?
    var count = this.photos.length;
    console.log(count);

    var badPhotos = [];

    files.photos.forEach((p, i)=>{
      if(p.size === 0){ badPhotos.push(p); return; }

      var photo = {};
      var path = p.path;
      var fileName = p.originalFilename;
      photo.fileName = fileName;
      photo.path = `/img/recipeImages/${this._id}/${fileName}`;

      photo.isPrimary = false;
      photo.order = count + i;

      photo.caption = p.caption;
      this.photos.push(photo);

      fs.renameSync(path, `${__dirname}/../static/img/recipeImages/${this._id}/${fileName}`);
    });

    if(badPhotos.length){
      fn(null);
      return;
    }

    fn(this);
  }

  updatePhotos(userId, property, index, editedField, fn){

    // if(typeof userId === 'string'){
    //   if(userId.length !== 24){fn(null); return;}
    // }else if(userId instanceof Mongo.ObjectID){
    //   if(userId.length !== 24){fn(null); return;}
    //   userId = userId.toString();
    // }
    //
    // if(this.userId !== userId){fn(null); return;}


    //--- CHECK TO MAKE SURE USER IS OWNER --

    if(!(isOwner(userId, this.userId))){
      fn(null);
      return;
    }

    //-- SWITCH ON PROPERTY --

    index = index * 1;
    var editedIndex;

    switch(property){
      case 'isPrimary':
        this.photos.map(p=>p.isPrimary = false);
        this.photos[index].isPrimary = true;
        break;

      case 'caption':
        this.photos[index].caption = editedField;
        break;

      case 'order':
        editedIndex = editedField * 1;
        this.photos[index].order = editedIndex;
        this.photos[editedIndex].order = index;

        var newPhotoOrder = this.photos.sort(function(a,b){
          return a.order - b.order;
        });

        this.photos = newPhotoOrder;
    }

    fn(this);
  }

  edit(userId, property, index, editedField, fn){

    //--- CHECK TO MAKE SURE USER IS OWNER --

    if(!(isOwner(userId, this.userId))){
      fn(null);
      return;
    }

    // //--- CHECK TO MAKE SURE USER IS OWNER --
    //
    // if(typeof userId === 'string'){
    //   if(userId.length !== 24){fn(null); return;}
    // }else if(userId instanceof Mongo.ObjectID){
    //   if(userId.length !== 24){fn(null); return;}
    //   userId = userId.toString();
    // }
    //
    // if(this.userId !== userId){fn(null); return;}

    //-- SWITCH ON PROPERTY --

    index = index * 1;
    var editedIndex;

    switch(property){
      case 'title':
        this.title = editedField.trim();
        break;

      case 'description':
        this.description = editedField.trim();
        break;

      case 'notes':
        this.notes = editedField.trim();
        break;

      case 'brewTime':
        this.brewTime = editedField.trim();
        break;

      case 'grind':
        this.grind = editedField.trim();
        break;

      case 'video':
        this.video = editedField.trim();
        break;

      case 'waterRatio':
        this.ratio.water = editedField * 1;
        break;

      case 'coffeeRatio':
        this.ratio.coffee = editedField * 1;
        break;

      case 'ratioUnit':
        this.ratio.unit = editedField.trim();
        break;

      case 'instructions.order':
        editedIndex = editedField * 1;
        this.instructions[index].order = editedIndex;
        this.instructions[editedIndex].order = index;

        var newInstructionOrder = this.instructions.sort(function(a,b){
          return a.order - b.order;
        });

        this.instructions = newInstructionOrder;
        break;

      case 'instructions.text':
        this.instructions[index].text = editedField.trim();
        break;

      case 'instructions.displayTime':
        var time = editedField.split(':').map(n=>n*1);
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

        this.instructions[index].timer = totalTime;
        this.instructions[index].displayTime = editedField.trim();
        break;

      case 'prep.order':
        editedIndex = editedField * 1;
        this.prep[index].order = editedIndex;
        this.prep[editedIndex].order = index;

        var newPrepOrder = this.prep.sort(function(a,b){
          return a.order - b.order;
        });

        this.prep = newPrepOrder;

        break;

      case 'prep.text':
        this.prep[index].text = editedField.trim();
    }

    fn(this);
  }

  addInstructions(fields, files, fn){

    //--- RATIO ---
    this.ratio = {};
    this.ratio.water = fields.waterRatio[0] * 1;
    this.ratio.coffee = fields.coffeeRatio[0] * 1;
    this.ratio.unit = fields.ratioUnit[0].trim();


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
      instructionStep.displayTime = obj.timer;
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
    var badPhotos = [];

    files.photos.forEach((p, i)=>{
      //console.log('=== made it inside photos for each ===');
      if(p.size === 0){ badPhotos.push(p); return; }

      var photo = {};
      var path = p.path;
      // console.log('=== PATH ===');
      // console.log(path);
      var fileName = p.originalFilename;
      photo.fileName = fileName;
      photo.path = `/img/recipeImages/${this._id}/${fileName}`;
      if(i){
        photo.isPrimary = false;
        photo.order = 1;
      }else{
        photo.isPrimary = true;
        photo.order = i;
      }
      photo.caption = p.caption;
      this.photos.push(photo);

      mkdirp(`${__dirname}/../static/img/recipeImages/${this._id}`);
      fs.renameSync(path, `${__dirname}/../static/img/recipeImages/${this._id}/${fileName}`);
    });

    if(badPhotos.length){
      //console.log('=== returning null ===');
      fn(null);
      return;
    }

    // console.log('=== exited the loop, returning this ===');
    // console.log(this);
    fn(this);
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

        var recipe = new Recipe();
        recipe._id = Mongo.ObjectID(obj._id);
        recipe.userId = obj.userId;
        recipe.brewMethodId = obj.brewMethodId[0];
        recipe.title = obj.title[0];
        recipe.description = obj.description[0];
        recipes.save(recipe, ()=>fn(recipe));
      }
    });
  }

}


//--- CHECK TO MAKE SURE USER IS RECIPE OWNER -- //

function isOwner(userId, ownerId){
  if(typeof userId === 'string'){
    if(userId.length !== 24){return null;}
  }else if(userId instanceof Mongo.ObjectID){
    if(userId.length !== 24){return null;}
    userId = userId.toString();
  }

  if(ownerId !== userId){
    return false;
  }else{
    return true;
  }
}


module.exports = Recipe;
