'use strict';

exports.login = (req, res)=>{
  res.render('users/login', {message: req.flash('loginMessage'), title: 'Login'});
};

exports.signup = (req, res)=>{
  res.render('users/signup', {message: req.flash('registerMessage'), title: 'Register'});
};

exports.profile = (req, res)=>{
  console.log(req.user);
  res.render('users/profile', {user: req.user, message: req.flash('registerMessage'), title: 'Profile'});
};
