var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/register', (req, res, next) => {
  res.render('registerForm');
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err){
      return next(err);
    }
    console.log(user);
    res.redirect('/');
  })
})

module.exports = router;
