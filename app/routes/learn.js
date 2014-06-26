'use strict';

var traceur = require('traceur');
var BrewMethod = traceur.require(__dirname + '/../models/brewmethod.js');

exports.index = (req, res)=>{
  BrewMethod.findAll(brewMethods=>{
    res.render('learn/index', {user: req.user, brewMethods:brewMethods, title: 'Kaffepaus - Learn'});
  });
};

exports.show = (req, res)=>{
  var brewMethodId = req.params.id;
  BrewMethod.findById(brewMethodId, (err, brewMethod)=>{
    res.render('learn/show', {user: req.user, brewMethod:brewMethod, title: 'Kaffepaus - Learn'});
  });
};
