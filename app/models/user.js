/* jshint unused:false */

'use strict';

var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
// var Base = traceur.require(__dirname + '/base.js');
//var bcrypt = require('bcrypt-nodejs');


class User{
  constructor(){
    this.local = {
      email:    String,
      password: String
    };
    this.facebook = {
      id:       String,
      token:    String,
      email:    String,
      name:     String
    };
    this.twitter = {
      id:       String,
      token:    String,
      displayName: String,
      username:   String
    };
    this.google = {
      id: String,
      token: String,
      email: String,
      name: String
    };
  }

  //
  // // methods ======================
  // // generating a hash
  // userSchema.methods.generateHash = function(password) {
  //     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  // };
  //
  // // checking if password is valid
  // userSchema.methods.validPassword = function(password) {
  //     return bcrypt.compareSync(password, this.local.password);
  // };


}

module.exports = User;
