/* jshint unused:false */

'use strict';

var brewMethods = global.nss.db.collection('brewMethods');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class BrewMethod{

  static findById(id, fn){
    Base.findById(id, brewMethods, BrewMethod, fn);
  }

  static findAll(fn){
    Base.findAll(brewMethods, BrewMethod, fn);
  }
}

module.exports = BrewMethod;
