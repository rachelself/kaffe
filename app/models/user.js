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

  // /* ====== Add Photo ======= */
  //
  // addPhoto(obj, fn){
  //   if(!obj.photo[0].size){fn(null); return;}
  //   var fileName = obj.photo[0].originalFilename;
  //
  //   this.photo = `/img/userImages/${this._id}/${fileName}`;
  //
  //   var path = obj.photo[0].path;
  //   // console.log('var path from user model ===');
  //   // console.log(path);
  //
  //   // if(path[0] !== '/'){
  //   //   path = __dirname + '/' + path;
  //   // }
  //   // console.log('==== made it past the if statement about paths ===');
  //   mkdirp(`${__dirname}/../static/img/userImages/${this._id}`);
  //   // console.log('==== made it past mkdirp ===');
  //   fs.renameSync(path, `${__dirname}/../static/img/userImages/${this._id}/${fileName}`);
  //   fn(this);
  //   // console.log('==== made it past fs move file ===');
  // }

  /* ====== EDIT ======= */

  edit(fields, files, fn){

    //--- FIELDS (everything else)

    console.log(this);
    this.local.firstName = fields.firstName[0];
    this.local.lastName = fields.lastName[0];
    this.local.isCompany = fields.isCompany[0];
    this.local.bio = fields.bio[0];
    this.local.photo = `/img/userImages/${this._id}/${fileName}`;

    if(!files.photo[0].size){fn(null); return;}

    //--- FILES (photos)

    // does this user have an image directory?
    if(!fs.existsSync(`__dirname/../../../app/static/img/userImages/${this._id}`)){
      mkdirp(`${__dirname}/../static/img/userImages/${this._id}`);
    }

    var dirContents = fs.readdirSync(`${__dirname}/../static/img/userImages/${this._id}`);
    var path = files.photo[0].path;
    var fileName = files.photo[0].originalFilename;
    console.log('==== dirContents ====');

    // does this user have any images IN the directory?
    if(dirContents.length !== 0){
      console.log('==== dirContents has at least 1 item ====');

      // contents = 1 or +1?
      if(dirContents.length !== 1){
        console.log('==== dircContents had more than 1 item ====');
        fn(null);
        return;

      // contents = 1
      }else{
        console.log('==== removing old image ====');
        var oldImgPath = dirContents[0];
        fs.unlinkSync(`${__dirname}/../static/img/userImages/${this._id}/${oldImgPath}`);

        fs.renameSync(path, `${__dirname}/../static/img/userImages/${this._id}/${fileName}`);
        console.log('==== moved the image ====');

        // this.photo = `/img/userImages/${this._id}/${fileName}`;
        console.log('==== overwrote the property photo on user obj ====');
      }

      // dir was empty
    }else{
      console.log('==== dirContents is empty ====');
      fs.renameSync(path, `${__dirname}/../static/img/userImages/${this._id}/${fileName}`);

    }

    fn(this);

  }

  static findById(id, fn){
    Base.findById(id, users, User, fn);
  }

  static findAll(fn){
    Base.findAll(users, User, fn);
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
