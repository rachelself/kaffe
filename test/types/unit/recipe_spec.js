/* global before, beforeEach, describe, it */
/* jshint expr: true */

'use strict';

process.env.DBNAME = 'kaffe-test';

//var cp = require('child_process');
var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
//var fs = require('fs');
var factory = traceur.require(__dirname + '/../../helpers.factory.js');

var Recipe;

describe('Recipe', function(){
  before(function(done){
    db(function(){
      Recipe = traceur.require(__dirname + '/../../../app/models/recipe.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('recipes').drop(function(){
      factory('recipe', function(recipes){
        done();
      });
    });
  });



  describe('.findById', function(){
    it('should find a recipe by its id', function(done){
      var id = '0123456789abcdef01234567';
      Recipe.findById(id, function(err, recipe){
        console.log(recipe);
        expect(recipe).to.be.ok;
        expect(recipe).to.be.an('object');
        expect(recipe.instructions).to.be.instanceof(Array);
        expect(recipe.ratio.water[0]).to.equal(230);
        done();
      });
    });
  });


});
