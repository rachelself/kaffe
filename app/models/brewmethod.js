/* jshint unused:false */

'use strict';

var brewmethods = global.nss.db.collection('brewmethods');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class BrewMethod{

  static findById(id, fn){
    Base.findById(id, brewmethods, BrewMethod, fn);
  }

  static findAll(fn){
    Base.findAll(brewmethods, BrewMethod, fn);
  }
}

module.exports = BrewMethod;
