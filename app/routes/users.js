'use strict';

exports.login = (req, res)=>{
  res.render('users/login', {message: req.flash('loginMessage'), title: 'Login'});
};

exports.signup = (req, res)=>{
  res.render('users/signup', {message: req.flash('registerMessage'), title: 'Register'});
};

exports.profile = (req, res)=>{
  isLoggedIn(req, res);
  res.render('users/profile', {message: req.flash('registerMessage'), title: 'Profile'});
};

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/');
  }
}
