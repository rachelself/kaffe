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

  addUserRating(obj, fn){

    //-- CHECK TO SEE IF USER HAS ALREADY GIVEN RATING --//

    var isRated = [];
    this.ratings.forEach(checkUserRatings);

    function checkUserRatings(r){
      if(r.userId === obj.userId){
        isRated.push(r);
        return;
      }else{
        return;
      }
    }

    if(isRated.length){
      // console.log('this user has already rated this recipe');
      fn(null);
      return;
    }

    //-- IF NOT, PUSH IN RATING --//

    var userRating = {};
    userRating.userId = obj.userId;
    userRating.stars = obj.stars * 1;
    this.ratings.push(userRating);
    var count = this.ratings.length;
    var newRating = obj.stars * 1;
    // console.log('=== COUNT ====');
    // console.log(count);
    this.avgRating = (this.avgRating + newRating) / count;
    // console.log('=== new rating added! ====');
    // console.log(this);
    ratings.save(this, ()=>fn(this));
  }

  save(fn){
    ratings.save(this, ()=>{
      fn();
    });
  }

  static findByUserId(objs, id, fn){
    // console.log('=== ALL RATINGS ====');
    // console.log(objs);

    var usersRatings = [];
    objs.forEach(examineRatings);

    function examineRatings(o){
      // console.log('inside examineRatings');
      // console.log(o);
      o.ratings.forEach(isMatch);
    }

    function isMatch(r){
      // console.log('inside isMatch');
      if(r.userId === id){
        usersRatings.push(r);
        // console.log('pushing in a match!!');
        // console.log(r);
      }
    }

    if(usersRatings.length){
      console.log('===== USERS RATINGS =====');
      console.log(usersRatings);
      fn(usersRatings);
    }else{
      fn(null);
    }
  }

  static findByRecipeId(id, fn){
    ratings.findOne({recipeId:id}, (err, rating)=>{
      if(!rating){
        fn(null);
      }else{
        rating = _.create(Rating.prototype, rating);
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
        rating.ratings = [];
        //rating.ratings.push(ratingObj);
        rating.avgRating = null;
        ratings.save(rating, ()=>fn(rating));
      }
    });
  }





}





module.exports = Rating;
