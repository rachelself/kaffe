/* global before, beforeEach, afterEach, describe, it */
/* jshint expr: true */
/* jshint camelcase:false */

'use strict';

process.env.DBNAME = 'kaffe-test';

var cp = require('child_process');
var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var fs = require('fs');

var Recipe;

describe('Recipe', function(){
  before(function(done){
    db(function(){
      Recipe = traceur.require(__dirname + '/../../../app/models/recipe.js');
    //  console.log('== before ran ===');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('recipes').drop(function(){
    //  console.log('== dropped the collection ===');
      factory('recipe', function(recipes){
        //console.log('== finished running the factory ===');
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a recipe by its id', function(done){
      var id = '53a37a7dabc0ef3158df9939';
      Recipe.findById(id, function(recipe){
        // console.log('==== the recipe that was found by ID======');
        // console.log(recipe);
        // console.log('==== the err ======');
        // console.log(err);
        expect(recipe).to.be.ok;
        expect(recipe).to.be.an('object');
        expect(recipe.description).to.be.a('string');
        expect(recipe.brewMethodId).to.equal('53a37a7dabc0ef3158df9935');
        done();
      });
    });

    it('should NOT find a recipe by its id - BAD ID', function(done){
      var id = 'not an id';
      Recipe.findById(id, function(response){
        // expect(response).to.be.undefined;
        expect(response).to.be.null;
        done();
      });
    });
  });

  describe('.create', function(){
    it('should create a new recipe in the db', function(done){
      var recipe = {_id:'53a37a7dabc0ef3158df9941', userId:'53a1b99efc3d30e20e7e5b69', brewMethodId:['53a37a7dabc0ef3158df9935'], title:['A really good title'], description:['about this recipe...']};
      Recipe.create(recipe, function(recipe){
        // console.log('==== the recipe in the DB!!======');
        // console.log(recipe);
        expect(recipe).to.be.ok;
        expect(recipe).to.be.an('object');
        expect(recipe.description).to.be.a('string');
        expect(recipe.userId).to.equal('53a1b99efc3d30e20e7e5b69');
        done();
      });
    });

    it('should NOT create a new recipe in the db - DUPLICATE TITLE', function(done){
      var recipe = {_id:'53a37a7dabc0ef3158df9942', userId:'53a1b99efc3d30e20e7e5b69', brewMethodId:['53a37a7dabc0ef3158df9935'], title:['A really good title'], description:['about this recipe...']};
      Recipe.create(recipe, function(recipe){
        // console.log('==== the recipe in the DB!!======');
        // console.log(recipe);
        expect(recipe).to.be.ok;
        expect(recipe).to.be.an('object');
        expect(recipe.description).to.be.a('string');
        expect(recipe.userId).to.equal('53a1b99efc3d30e20e7e5b69');
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find all recipes in the db', function(done){
      Recipe.findAll(function(recipes){
        expect(recipes).to.be.ok;
        expect(recipes).to.be.instanceof(Array);
        expect(recipes).to.have.length(2);
        expect(recipes[0]).to.have.deep.property('title', 'V60 2014 Champion Recipe');
        done();
      });
    });
  });

  describe('.findByBrewMethod', function(){
    it('should find all recipes for a brew method', function(done){
      var brewMethodId = '53a37a7eabc0ef3158df9938';
      Recipe.findByBrewMethod(brewMethodId, function(recipes){
        expect(recipes).to.be.ok;
        expect(recipes).to.be.instanceof(Array);
        expect(recipes).to.have.length(1);
        expect(recipes[0]).to.have.deep.property('title', 'Inverted Method');
        done();
      });
    });

    it('should NOT find all recipes for a brew method - NONE found', function(done){
      var brewMethodId = '53a37a7eabc0ef3158df993b';
      Recipe.findByBrewMethod(brewMethodId, function(recipes){
        expect(recipes).to.be.null;
        done();
      });
    });
  });

  describe('.findByCreator',function(){
    it('should find all recipes created by a certain user', function(done){
      var user = '53a1b7fb5f7b558f0e623b53';
      Recipe.findByCreator(user, function(recipes){
        expect(recipes).to.be.ok;
        expect(recipes).to.be.instanceof(Array);
        expect(recipes.length).to.equal(1);
        expect(recipes[0]).to.have.deep.property('title','Inverted Method');
        done();
      });
    });

    it('should NOT find all recipes created by a certain user - NO RECIPES', function(done){
      var user = '53a1b27f00bf1c750ef17da5';
      Recipe.findByCreator(user, function(recipes){
        expect(recipes).to.be.null;
        done();
      });
    });
  });

  describe('#addInstructions', function(){
    beforeEach(function(done){
      cp.execFile(__dirname + '/../../fixtures/before-recipe.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      done();
      });
    });

    afterEach(function(done){
      cp.execFile(__dirname + '/../../fixtures/after-recipe.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
        done();
      });
    });

    it('should add instructions, ratio, and other properties to the recipe', function(done){
      var recipeId = '53a37a7dabc0ef3158df9940';
      var fields = {'waterRatio':['230', 'grams'], 'coffeeRatio':['15', 'grams'], 'notes':['blah'], 'brewTime':['1:30'], 'prep':[{'step':'You need a mug'}, {'step':'Boil some water.'}], 'grind':['Like sawdust'], 'instructions':[{'step':'Heres what to do', 'timer':'0:00'}, {'step':'Heres what to do', 'timer':'0:40'}, {'step':'Heres what to do', 'timer':'1:30'}]};
      var files = {'photos':[{originalFilename:'aeropress1-RECIPE.jpg', path: __dirname + '/../../fixtures/copy-recipe/aeropress1-RECIPE.jpg', 'size':'200', 'caption':'Pressing the coffee'}], 'video':['http://vimeo.com/4722171']};

      Recipe.findById(recipeId, function(recipe){
        // console.log('=== before we update recipe ====');
        // console.log(recipe);
        recipe.addInstructions(fields, files, function(recipe){
          // console.log('==== the recipe that was updated, coming back ====');
          // console.log(recipe);
          expect(recipe).to.be.ok;
          expect(recipe).to.be.an('object');
          expect(recipe).to.be.instanceof(Recipe);
          expect(recipe.title).to.equal('Inverted Method');
          expect(recipe.instructions).to.be.instanceof(Array);
          expect(recipe.instructions).to.have.length(3);
          expect(recipe.instructions[1]).to.have.deep.property('timer', 40);
          expect(recipe.instructions[0]).to.be.an('object');
          expect(recipe.ratio.water[0]).to.equal(230);
          expect(recipe.ratio.water[1]).to.equal('grams');
          expect(recipe.photos[0]).to.have.deep.property('path', '/img/recipeImages/53a37a7dabc0ef3158df9940/aeropress1-RECIPE.jpg');

          var imgExists = fs.existsSync(__dirname + '/../../../app/static/img/recipeImages/53a37a7dabc0ef3158df9940/aeropress1-RECIPE.jpg');
          expect(imgExists).to.be.true;
          done();
        });
      });
    });
    
    // it('should NOT add properties to ')
  });



});
