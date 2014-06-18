/* jshint unused:false */

'use strict';

var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');


class User{
  constructor(){
    this.local = {
      email:    null,
      password: null,
    };
    this.facebook = {
      id:       null,
      token:    null,
      email:    null,
      name:     null
    };
    this.twitter = {
      id:       null,
      token:    null,
      displayName: null,
      username:   null
    };
    this.google = {
      id: null,
      token: null,
      email: null,
      name: null
    };
  }

  save(fn){
    users.save(this, ()=>{
      fn();
    });
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  validPassword(password) {
    return bcrypt.compareSync(password, this.local.password);
  }

  static findById(id, fn){
    Base.findById(id, users, User, fn);
  }

  static findByEmail(email, fn){
    users.findOne({'local.email': email}, (err, user)=>{
      // console.log('---- email ----');
      // console.log(email);
      // console.log('======= user ======');
      // console.log(user);
      // console.log('======= error ======');
      // console.log(err);
      if(user){
        fn(null);
      }else{
        fn();
      }
    });
  }




}

module.exports = User;
