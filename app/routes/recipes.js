'use strict';

exports.index = (req, res)=>{
  res.render('recipes/index', {user: req.user, title: 'Recipes'});
};
