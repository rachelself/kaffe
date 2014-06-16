// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '458210907648673',
		'clientSecret' 	: '02f9872a997f8f462a70a53e626c44c1',
		'callbackURL' 	: 'http://localhost:3001/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: '63R574jvCXGVDTRz5pAYFwxDv',
		'consumerSecret' 	: 'UPKSWpUwbJrhoxCYhghoW5O1fTkDlwWSLO0EyP4SFX5UjnKI2X',
		'callbackURL' 		: 'http://localhost:3001/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '483317150980-ustb6p9kgnfojodj733iicccctfkrau8.apps.googleusercontent.com',
		'clientSecret' 	: 'lIIqU1k_MOGewmlNur4wGnhY',
		'callbackURL' 	: 'http://localhost:3001/auth/google/callback'
	}

};


// twitter callback:
// http://192.168.1.101.:3001/auth/twitter/callback
