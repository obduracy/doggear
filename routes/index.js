var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Doggear', user: req.user });
});

// render dash 
router.get('/library', function(req, res){
	if(!req.user || req.user.status !== 'ENABLED') {
		return res.redirect('/login');
	}
	res.render('library', {title: 'My Library', user: req.user });
});

// render profile

router.get('/profile', function(req, res, next) {

  res.render('profile', { title: 'My Profile', user: req.user });
});

module.exports = router;
