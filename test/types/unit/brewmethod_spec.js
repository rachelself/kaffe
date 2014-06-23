/* global before, describe, it */
/* jshint expr: true */

'use strict';

process.env.DBNAME = 'kaffe-test';

//var cp = require('child_process');
var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
//var fs = require('fs');

var BrewMethod;

describe('BrewMethod', function(){
  before(function(done){
    db(function(){
      BrewMethod = traceur.require(__dirname + '/../../../app/models/brewmethod.js');
      done();
    });
  });

  describe('.findById', function(){
    it('should find a brewMethod by its id', function(done){
      var id = '53a37a7dabc0ef3158df9935';
      BrewMethod.findById(id, function(err, method){
        console.log(method);
        expect(method).to.be.ok;
        expect(method).to.be.an('object');
        expect(method).to.have.deep.property('name', 'V60');
        done();
      });
    });

    it('should NOT find a brewMethod - BAD ID', function(done){
      var id = 'not an id';
      BrewMethod.findById(id, function(err, method){
        console.log(method);
        expect(method).to.be.undefined;
        expect(err).to.be.null;
        done();
      });
    });
  });

  describe('.findAll', function(){
    it('should find all brew methods in the db', function(done){
      BrewMethod.findAll(function(methods){
        expect(methods).to.be.ok;
        expect(methods).to.be.instanceof(Array);
        expect(methods).to.have.length(8);
        expect(methods[0]).to.have.deep.property('name', 'V60');
        done();
      });
    });
  });

});
