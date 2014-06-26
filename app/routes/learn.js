'use strict';

var traceur = require('traceur');
var BrewMethod = traceur.require(__dirname + '/../models/brewmethod.js');

exports.index = (req, res)=>{
  BrewMethod.finAll(brewMethods=>{
    res.render('learn/index', {user: req.user, brewMethods:brewMethods, title: 'Kaffepaus - Learn'});
  });
};

// exports.chemex = (req, res)=>{
//   res.render('learn/index', {user: req.user, title: 'Kaffepaus - Learn'});
// };
