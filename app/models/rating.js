/* jshint unused:false */

'use strict';

var recipes = global.nss.db.collection('recipes');
var ratings = global.nss.db.collection('ratings');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var _ = require('lodash');
//var mkdirp = require('mkdirp');
//var fs = require('fs');
var _ = require('lodash');


class Rating{

  save(fn){
    recipes.save(this, ()=>{
      fn();
    });
  }

  static findByRecipeId(id, fn){
    ratings.findOne({recipeId:id}, (err, rating)=>{
      if(!rating){
        fn(null);
      }else{
        fn(rating);
      }
    });
  }

  static findById(id, fn){
    Base.findById(id, ratings, Rating, fn);
  }

  static findAll(fn){
    Base.findAll(ratings, Rating, fn);
  }

  static create(obj, fn){
    // console.log('=== made it inside create method');
    //var id = Mongo.ObjectID(obj.recipeId);
    ratings.findOne({recipeId:obj.recipeId}, (err, r)=>{
      if(r){
        //console.log('=== found a rating record for that recipe ===');
        //console.log(r);
        fn(null);
      }else{
        var rating = new Rating();
        if(obj._id){
          rating._id = Mongo.ObjectID(obj._id);
        }
        rating.recipeId = obj.recipeId;
        //var ratingObj = {};
        // ratingObj.userId = obj.userId;
        // ratingObj.stars = obj.stars;
        // rating.ratings = [];
        //rating.ratings.push(ratingObj);
        rating.avgRating = null;
        ratings.save(rating, ()=>fn(rating));
      }
    });
  }





}


module.exports = Rating;
