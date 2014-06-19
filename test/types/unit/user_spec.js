/* global before, beforeEach, afterEach, describe, it */
/* jshint expr: true */

'use strict';

process.env.DBNAME = 'kaffe-test';

var cp = require('child_process');
var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var fs = require('fs');
var Mongo = require('mongodb');


var User;

describe('User', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../../fixtures/before.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
    done();
    });
  });

  afterEach(function(done){
    cp.execFile(__dirname + '/../../fixtures/after.sh', {cwd:__dirname + '/../../fixtures'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('.findById', function(){
    it('should find a user by Id', function(done){
      User.findById('53a1b99efc3d30e20e7e5b69', function(err, user){
        expect(user.local).to.be.an('object');
        expect(err).to.be.a('null');
        expect(user.local.email).to.deep.equal('sue@aol.com');
        expect(user).to.be.instanceof(User);
        expect(user.local.password).to.have.length(60);
        done();
      });
    });

    it('should NOT successfully find a user - bad id', function(done){
      User.findById('not an id', function(err, user){
        expect(user).to.be.undefined;
        expect(err).to.be.null;
        done();
      });
    });

    it('should NOT successfully find a user - NULL', function(done){
      User.findById(null, function(err, user){
        expect(user).to.be.undefined;
        expect(err).to.be.null;
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find all users in the db', function(done){
      User.findAll(function(users){
        expect(users).to.be.instanceof(Array);
        expect(users).to.have.length(3);
        expect(users).to.have.deep.property('[2].local.email', 'sue@aol.com');
        done();
      });
    });
  });

  // describe('#addPhoto', function(done){
  //   it('should add photo property to user - RELATIVE photo path', function(done){
  //     var files = {photo:[{originalFilename:'sue-DELETE.jpg', path: __dirname + '/../../fixtures/copy/sue-DELETE.jpg', size:4}]};
  //     var id = '53a1b99efc3d30e20e7e5b69';
  //
  //     User.findById(id, function(err, user){
  //       user.addPhoto(files, function(user){
  //         expect(user).to.have.deep.property('photo', '/img/userImages/53a1b99efc3d30e20e7e5b69/sue-DELETE.jpg');
  //
  //         var imgExists = fs.existsSync(__dirname + '/../../../app/static/img/userImages/53a1b99efc3d30e20e7e5b69/sue-DELETE.jpg');
  //         expect(imgExists).to.be.true;
  //         done();
  //       });
  //     });
  //   });
  // });
  //
  // describe('#addPhoto', function(done){
  //   it('should NOT add photo property to user - NO PHOTO', function(done){
  //     var files = {photo:[{originalFilename:'sue-DELETE.jpg', path: __dirname + '/../../fixtures/copy/sue-DELETE.jpg', size:0}]};
  //     var id = '53a1b99efc3d30e20e7e5b69';
  //
  //     User.findById(id, function(err, user){
  //       user.addPhoto(files, function(user){
  //         expect(user).to.be.null;
  //
  //         var imgExists = fs.existsSync(__dirname + '/../../../app/static/img/userImages/53a1b99efc3d30e20e7e5b69/sue-DELETE.jpg');
  //         expect(imgExists).to.be.false;
  //         done();
  //       });
  //     });
  //   });
  // });

  describe('#edit', function(done){
    it('should update a user record in the db - NEW PHOTO', function(done){
      var fields = {firstName:['Sue'], lastName:['Smith'], isCompany:[false], bio:['This is just a little bit about me...']};
      var files = {photo:[{originalFilename:'sue2-DELETE.jpg', path: __dirname + '/../../fixtures/copy/sue2-DELETE.jpg', size:4}]};
      var id = '53a1b99efc3d30e20e7e5b69';

      User.findById(id, function(err, user){
        user.edit(fields, files, function(user){
          expect(user).to.be.ok;
          expect(user).to.exist;
          expect(user).to.be.instanceof(User);
          expect(user.firstName).to.equal('Sue');

          expect(user).to.have.deep.property('photo', '/img/userImages/53a1b99efc3d30e20e7e5b69/sue2-DELETE.jpg');
          expect(user.bio).to.equal('This is just a little bit about me...');
          expect(user.isCompany).to.be.false;

          var newImgExists = fs.existsSync(__dirname + '/../../../app/static/img/userImages/53a1b99efc3d30e20e7e5b69/sue2-DELETE.jpg');
          var oldImgExists = fs.existsSync(__dirname + '/../../../app/static/img/userImages/53a1b99efc3d30e20e7e5b69/sue-DELETE.jpg');

          expect(newImgExists).to.be.true;
          expect(oldImgExists).to.be.false;
          done();
        });
      });
    });

    it('should NOT update a user record in the db - NO PHOTO', function(done){
      var fields = {firstName:['Sue'], lastName:['Smith'], isCompany:[false], bio:['This is just a little bit about me...']};
      var files = {photo:[{originalFilename:'sue-DELETE.jpg', path: __dirname + '/../../fixtures/copy/sue-DELETE.jpg', size:0}]};
      var id = '53a1b99efc3d30e20e7e5b69';

      User.findById(id, function(err, user){
        user.edit(fields, files, function(err, user){
          expect(err).to.be.null;
          expect(user).to.be.an('undefined');

          var newImgExists = fs.existsSync(__dirname + '/../../../app/static/img/userImages/53a1b99efc3d30e20e7e5b69/sue-DELETE.jpg');
          var oldImgExists = fs.existsSync(__dirname + '/../../../app/static/img/userImages/53a1b99efc3d30e20e7e5b69/sue2-DELETE.jpg');

          expect(newImgExists).to.be.false;
          expect(oldImgExists).to.be.true;
          done();
        });
      });
    });
  });

  describe('#addToLibrary', function(){
    it('should create a new object in the users recipeLibrary', function(done){
      var recipeId = '53a1b99efc3d30e20e7e5b71';
      var userId = '53a1b99efc3d30e20e7e5b69';

      User.findById(userId, function(err, user){
        user.addToLibrary(recipeId, function(recipe){
          expect(recipe).to.be.an('object');
          expect(recipe.id).to.be.instanceof(Mongo.ObjectID);
          expect(recipe.isStarred).to.be.false;
          done();
        });
      });
    });

    it('should NOT create a new object in the users recipeLibrary - BAD ID', function(done){
      var recipeId = 'not an id';
      var userId = '53a1b99efc3d30e20e7e5b69';

      User.findById(userId, function(err, user){
        user.addToLibrary(recipeId, function(recipe){
          expect(recipe).to.be.null;
          done();
        });
      });
    });
  });

  describe('#removeFromLibrary', function(){
    before(function(done){
      var recipeId = '53a1b99efc3d30e20e7e5b71';
      var userId = '53a1b99efc3d30e20e7e5b69';

      User.findById(userId, function(err, user){
        user.addToLibrary(recipeId, function(recipe){
          console.log(user);
          console.log('==== before finished =====');
          done();
        });
      });
    });

    it('should remove an object in the users recipeLibrary', function(done){
      var recipeId = '53a1b99efc3d30e20e7e5b71';
      var userId = '53a1b99efc3d30e20e7e5b69';

      User.findById(userId, function(err, user){
        user.removeFromLibrary(recipeId, function(recipeLibrary){
          expect(recipeLibrary).to.be.an.instanceof(Array);
          expect(recipeLibrary).not.to.include.keys('53a1b99efc3d30e20e7e5b71');
          done();
        });
      });
    });
  });

});

  // beforeEach(function(done){
  //   global.nss.db.collection('users').drop(function(){
  //     factory('user', function(users){
  //       console.log('===== USERS ======');
  //       console.log(users);
  //       done;
  //     });
  //   });
  // });


  // describe('#generateHash', function(){
  //   it('should create a hashed password', function(done){
  //     var obj = {'_id': '473910437284938102384737', 'local':{'email':'bill@aol.com', 'password':'5678'}, 'facebook':{}, 'twitter':{}, 'google':{}};
  //     User.create(obj, function(u){
  //       u.generateHash(u.password, function(p){
  //         expect(p).to.be.a('string');
  //         expect(p).to.be.ok;
  //         expect(p).to.have.length(60);
  //         done();
  //       });
  //     });
  //   });
  // });
