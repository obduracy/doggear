var express = require('express');
var router = express.Router();
var passport = require('passport');
var stormpath = require('stormpath');

// renders registration
router.get('/register', function(req, res){
	res.render('register', {title: 'Register', error: req.flash('error')[0]});
});

// registers new user to stormpath
router.post('/register', function(req, res) {

	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;

// get user fields

if (!username || !password) {
	return res.render('register', {title: 'Register', error: 'All fields required.'});
}



// initialise stormpath client
	var apiKey = new stormpath.ApiKey(
	process.env['STORMPATH_API_KEY_ID'],
	process.env['STORMPATH_API_KEY_SECRET']
	);

	var spClient = new stormpath.Client({ apiKey: apiKey });

// try to create this user's account
  var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
    if (err) throw err;
 
    app.createAccount({
      givenName: firstname,
      surname: lastname,
      username: username,
      email: email,
      password: password,
    }, function (err, createdAccount) {
      if (err) {
        return res.render('register', {title: 'Register', error: err.userMessage});
      } else {
        passport.authenticate('stormpath')(req, res, function () {
          return res.redirect('/');
        });
      }
    });
  });

});

// render login
router.get('/login', function(req, res){
	res.render('login', {title: 'Login', error: req.flash('error')[0]});
});

// authenticates user
router.post (
	'/login',
	passport.authenticate(
		'stormpath',
		{
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: 'Invalid username or password',

			}
		)
	);

// logs out user, redirects to login

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});



module.exports = router;
