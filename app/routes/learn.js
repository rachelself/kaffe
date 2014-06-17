'use strict';

exports.index = (req, res)=>{
  res.render('learn/index', {user: req.user, title: 'Kaffepaus - Learn'});
};
