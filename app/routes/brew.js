'use strict';


exports.index = (req, res)=>{
  res.render('brew/index', {user: req.user, title: 'Profile'});
};
