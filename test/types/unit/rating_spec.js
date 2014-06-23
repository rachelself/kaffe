/* global before, beforeEach, describe, it */
/* jshint expr: true */
/* jshint camelcase:false */

'use strict';

process.env.DBNAME = 'kaffe-test';

//var cp = require('child_process');
var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
// var fs = require('fs');

var Rating;

describe('Rating', function(){
  before(function(done){
    db(function(){
      Rating = traceur.require(__dirname + '/../../../app/models/rating.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('recipes').drop(function(){
      global.nss.db.collection('ratings').drop(function(){
        factory('recipe', function(recipes){
          factory('rating', function(ratings){
            // cp.execFile(__dirname + '/../../fixtures/before-recipe.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
              done();
            // });
          });
        });
      });
    });
  });

  describe('.create', function(){
    it('should create a new rating record in the db', function(done){
      var body = {'recipeId':'53a37a7dabc0ef3158df9939', 'userId':'53a1b7fb5f7b558f0e623b53'};

      Rating.create(body, function(rating){
        // console.log('=== the finished rating ===');
        // console.log(rating);
        expect(rating).to.be.ok;
        expect(rating).to.be.an('object');
        expect(rating).to.have.deep.property('recipeId', '53a37a7dabc0ef3158df9939');
        expect(rating.avgRating).to.be.null;
        done();
      });
    });

    it('should NOT create a new rating record in the db - DUPLICATE', function(done){
      var body = {'recipeId':'53a37a7dabc0ef3158df9940', 'userId':'53a1b7fb5f7b558f0e623b53'};

      Rating.create(body, function(rating){
        // console.log('=== the finished rating ===');
        // console.log(rating);
        expect(rating).to.be.null;
        done();
      });
    });

  });

  describe('.findById', function(){
    it('should find a rating based on its id', function(done){
      var id = '53a37a7dabc0ef3158df9999';
      Rating.findById(id, function(rating){
        expect(rating).to.be.ok;
        expect(rating).to.be.instanceof(Rating);
        expect(rating.recipeId).to.equal('53a37a7dabc0ef3158df9940');
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find all the ratings in the db', function(done){
      Rating.findAll(function(ratings){
        expect(ratings).to.be.ok;
        expect(ratings).to.be.instanceof(Array);
        expect(ratings).to.have.length(1);
        done();
      });
    });
  });

  describe('.findByRecipeId', function(){
    it('should find the rating record by its recipeId', function(done){
      var recipeId = '53a37a7dabc0ef3158df9940';
      Rating.findByRecipeId(recipeId, function(rating){
        expect(rating).to.be.ok;
        expect(rating).to.be.an('object');
        expect(rating.recipeId).to.equal('53a37a7dabc0ef3158df9940');
        done();
      });
    });
  });

  describe('#addUserRating', function(){
    beforeEach(function(done){
      var recipe = '53a37a7dabc0ef3158df9940';
      var obj = {'userId':'53a1b7fb5f7b558f0e623b53', 'stars':5};
      Rating.findByRecipeId(recipe, function(rating){
        rating.addUserRating(obj, function(rating){
          rating.save(function(){
            done();
          });
        });
      });
    });

    it('should add a rating object for that user into the ratings array', function(done){
      var recipe = '53a37a7dabc0ef3158df9940';
      var obj = {'userId':'53a1b99efc3d30e20e7e5b69', 'stars':4};
      Rating.findByRecipeId(recipe, function(rating){
        // console.log('found the rating!');
        //console.log(rating);
        rating.addUserRating(obj, function(rating){
          expect(rating).to.be.ok;
          expect(rating).to.be.instanceof(Rating);
          expect(rating.ratings).to.be.instanceof(Array);
          expect(rating.ratings).to.have.length(2);
          expect(rating.ratings[0]).to.be.an('object');
          expect(rating.ratings[0]).to.be.have.deep.property('userId', '53a1b7fb5f7b558f0e623b53');
          expect(rating.avgRating).to.be.equal(4.5);
          done();
        });
      });
    });

    it('should NOT add a rating object for that user into the ratings array - ALREADY RATED BY USER', function(done){
      var recipe = '53a37a7dabc0ef3158df9940';
      var obj = {'userId':'53a1b7fb5f7b558f0e623b53', 'stars':5};
      Rating.findByRecipeId(recipe, function(rating){
        rating.addUserRating(obj, function(rating){
          expect(rating).to.be.null;
          done();
        });
      });
    });

  });


});
