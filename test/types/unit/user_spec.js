/* global before, describe, it */
/* jshint expr: true */

'use strict';

process.env.DBNAME = 'kaffe-test';

//var cp = require('child_process');
var expect = require('chai').expect;
//var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
// var users = global.nss.db.collection('users');
//var factory = traceur.require(__dirname + '/../../helpers/factory.js');
//var request = require('supertest');

var User;

describe('User', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
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

  // describe('.findAll', function(){
  //   it('should find all users in the db', function(done){
  //     User.findAll(function(users){
  //       expect(users).to.be.instanceof(Array);
  //       expect(users).to.have.length(3);
  //       expect(users).to.have.deep.property('[2].local.email', 'sue@aol.com');
  //       done();
  //     });
  //   });
  // });

  

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


});
