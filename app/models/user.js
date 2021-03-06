/* jshint unused:false */

'use strict';

var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var mkdirp = require('mkdirp');
var fs = require('fs');
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
    this.firstName = '';
    this.lastName = '';
    this.isCompany = '';
    this.bio = '';
    this.photo = '';
    this.recipes = [];
    this.recipeLibrary = [];
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


  /* ====== EDIT ======= */

  edit(fields, files, fn){

    var path = files.photo[0].path;
    var fileName = files.photo[0].originalFilename;
    var id = this._id.toString();

    //--- FIELDS (everything else)

    this.firstName = fields.firstName[0].trim();
    this.lastName = fields.lastName[0].trim();
    this.bio = fields.bio[0].trim();
    this.photo = `/img/userImages/${id}/${fileName}`;


    //--- FILES (photos)

    if(!files.photo[0].size){fn(null); return;}

    // does this user have an image directory?
    if(!(fs.existsSync(`__dirname/../../../app/static/img/userImages/${id}`))){
      mkdirp(`${__dirname}/../static/img/userImages/${id}`);
    }

    var dirContents = fs.readdirSync(`${__dirname}/../static/img/userImages/${id}`);

    // does this user have any images IN the directory?
    if(dirContents.length !== 0){
      //==== dirContents has at least 1 item ====

      // contents = 1 or +1?
      if(dirContents.length !== 1){
        //==== dircContents had more than 1 item ====
        fn(null);
        return;

      // contents = 1
      }else{
        //==== removing old image ====
        var oldImgPath = dirContents[0];
        fs.unlinkSync(`${__dirname}/../static/img/userImages/${id}/${oldImgPath}`);

        //==== moved the image ====
        fs.renameSync(path, `${__dirname}/../static/img/userImages/${id}/${fileName}`);
      }

    }else{
      //==== dirContents is empty
      fs.renameSync(path, `${__dirname}/../static/img/userImages/${id}/${fileName}`);

    }

    fn(this);
  }

  addToLibrary(recipeId, recipeTitle, brewMethodId, brewMethodName, fn){

    if(!this.recipeLibrary){
      this.recipeLibrary = [];
    }

    var recipe = null;

    if(typeof recipeId === 'string'){
      if(recipeId.length !== 24){fn(null); return;}
    }else if(recipeId instanceof Mongo.ObjectID){
      if(recipeId.length !== 24){fn(null); return;}
      recipeId = recipeId.toString();
    }

    if(typeof brewMethodId === 'string'){
      if(brewMethodId.length !== 24){fn(null); return;}
    }else if(brewMethodId instanceof Mongo.ObjectID){
      if(brewMethodId.length !== 24){fn(null); return;}
      brewMethodId = brewMethodId.toString();
    }

    function isDuplicate(r){
      return r.id === recipeId;
    }

    var duplicateRecipes = this.recipeLibrary.filter(isDuplicate);

    if(duplicateRecipes.length > 0){
      fn(null);
      return;
    }else if(duplicateRecipes.length === 0){
      recipe = {};
      recipe.id = recipeId;
      recipe.title = recipeTitle;
      recipe.isStarred = false;
      recipe.brewMethodId = brewMethodId;
      recipe.brewMethodName = brewMethodName;
      recipe.isRated = false;

      this.recipeLibrary.push(recipe);
      fn(recipe);
    }
  }

  removeFromLibrary(id, fn){

    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
    }else if(id instanceof Mongo.ObjectID){
      id = id.toString();
      if(id.length !== 24){fn(null); return;}
    }

    var removed = _.remove(this.recipeLibrary, function(r){ return r.id === id; });
    fn(this.recipeLibrary);
  }

  showLibraryByBrewMethod(brewId, fn){
    var filteredRecipes;
    filteredRecipes = this.recipeLibrary.filter(isBrewMatch);

    function isBrewMatch(r){
      return r.brewMethodId === brewId;
    }

    if(filteredRecipes.length){
      fn(filteredRecipes);
    }else{
      fn(null);
    }
  }

  toggleFavorite(recipeId, fn){
    recipeId = recipeId.toString();

    var updated = this.recipeLibrary.map(toggle);

    function toggle(r){
      if(r.id === recipeId){
        if(r.isStarred === false){
          r.isStarred = true;
          return r;
        }else{
          r.isStarred = false;
          return r;
        }
      }else{
        return r;
      }
    }

    fn(this.recipeLibrary);
  }

  static findById(id, fn){
    Base.findById(id, users, User, fn);
  }

  static findAll(fn){
    Base.findAll(users, User, fn);
  }

  static findByEmail(email, fn){
    users.findOne({'local.email': email}, (err, user)=>{
      if(user){
        fn(null);
      }else{
        fn();
      }
    });
  }
}

module.exports = User;
