/* jshint unused:false */

'use strict';

var recipes = global.nss.db.collection('recipes');
var ratings = global.nss.db.collection('ratings');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var _ = require('lodash');
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
    this.avgRating = (this.avgRating + newRating) / count;
    ratings.save(this, ()=>fn(this));
  }

  save(fn){
    ratings.save(this, ()=>{
      fn();
    });
  }

  static findByUserId(objs, id, fn){

    var usersRatings = [];
    objs.forEach(examineRatings);

    function examineRatings(o){
      o.ratings.forEach(isMatch);
    }

    function isMatch(r){
      if(r.userId === id){
        usersRatings.push(r);
      }
    }

    if(usersRatings.length){
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
    ratings.findOne({recipeId:obj.recipeId}, (err, r)=>{
      if(r){
        fn(null);
      }else{
        var rating = new Rating();
        if(obj._id){
          rating._id = Mongo.ObjectID(obj._id);
        }
        rating.recipeId = obj.recipeId;
        rating.ratings = [];
        rating.avgRating = null;
        ratings.save(rating, ()=>fn(rating));
      }
    });
  }
}


module.exports = Rating;
