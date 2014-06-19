/* jshint unused:false */

'use strict';

var Mongo = require('mongodb');
var _ = require('lodash');


class Base{
  static findById(id, collection, model, fn){
    console.log('=== made it to find by id - BASE =====');
    console.log(id);
    if(typeof id === 'string'){
      if(id.length !== 24){fn(null); return;}
      id = Mongo.ObjectID(id);
    }
    if(!(id instanceof Mongo.ObjectID)){fn(null); return;}

    collection.findOne({_id:id}, (e,obj)=>{
      console.log('==== found an obj ====');
      console.log(obj);
      if(obj){
        obj = _.create(model.prototype, obj);
        console.log('==== changed obj prototype ====');
        console.log(obj);
        fn(null, obj);
      }else{
        fn(e, obj);
      }
    });
  }

  static findAll(collection, model, fn){
    collection.find().toArray((err, records)=>{
      records = records.map(r=>_.create(model.prototype, r));
      fn(records);
    });
  }


}

module.exports = Base;
