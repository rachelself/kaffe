'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var learn = traceur.require(__dirname + '/../routes/learn.js');
  var brew = traceur.require(__dirname + '/../routes/brew.js');
  var recipes = traceur.require(__dirname + '/../routes/recipes.js');
  var passport = require('passport');
  require('../config/passport')(passport);


  app.get('/', dbg, home.index);
  // app.get('/login', dbg, users.login);
  // app.get('/signup', dbg, users.signup);
  app.get('/profile', dbg, isLoggedIn, users.profile);

  app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/',
		failureFlash : true
	}));

  app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/',
		failureFlash : true
	}));

  // =====================================
  // ROUTES POST-LOGIN =====================
  // =====================================
  app.get('/profile/edit', dbg, users.edit);
  app.post('/profile', dbg, users.update);
  app.get('/profile/recipeLibrary', dbg, users.recipeLibrary);
  app.post('/profile/recipeLibrary', dbg, users.addToLibrary);
  app.post('/profile/recipeLibrary/favorites', dbg, users.toggleFavorite);
  app.get('/profile/settings', dbg, users.settings);

  app.get('/learn', dbg, learn.index);
  app.get('/brew', dbg, brew.index);
  app.get('/recipes', dbg, recipes.index);

  app.get('/recipes/new', dbg, recipes.new);
  app.post('/recipes', dbg, recipes.create);
  app.get('/recipes/filter/:id', dbg, recipes.filter);
  app.get('/recipes/add/:id', dbg, recipes.add);
  app.post('/recipes/:id', dbg, recipes.update);
  app.get('/recipes/:id', dbg, recipes.show);
  app.get('/recipes/edit/:id', dbg, recipes.edit);








  // =====================================
	// FACEBOOK ROUTES =====================
	// =====================================

	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


  // =====================================
	// TWITTER ROUTES ======================
	// =====================================

	app.get('/auth/twitter', passport.authenticate('twitter'));

	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));


  // =====================================
	// GOOGLE ROUTES =======================
	// =====================================

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));


  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

	// locally --------------------------------
		app.get('/connect/local', dbg, users.connectLocal);

		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile/settings',
			failureRedirect : '/connect/local',
			failureFlash : true
		}));

	// facebook -------------------------------

		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile/settings',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile/settings',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile/settings',
				failureRedirect : '/'
			}));


  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================

  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile/settings');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile/settings');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile/settings');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile/settings');
        });
    });



  console.log('Routes Loaded');
  fn();
}

function isLoggedIn(req, res, next) {

  if (req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/');
  }
}
