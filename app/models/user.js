/* jshint unused:false */

'use strict';

var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
// var Base = traceur.require(__dirname + '/base.js');
var bcrypt = require('bcrypt-nodejs');
var _ = require('lodash');


class User{
  constructor(){
    console.log('========= made it inside constructor!! =========');
    console.log(this);
    this.local = {
      email:    '',
      password: ''
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

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  save(fn){
    users.save(this, ()=>{
      fn();
    });
  }

  validPassword(password) {
    return bcrypt.compareSync(password, this.local.password);
  }

  static findById(id, fn){
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }
    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    users.findOne({_id:id}, (e,u)=>{
      if(u){
        u = _.create(User.prototype, u);
        fn(null, u);
      }else{
        fn(e,u);
      }
    });

  }




}

module.exports = User;
