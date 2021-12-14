var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

router.get('/login', (req, res, next) => {
  let error = req.flash("error");
  res.render('login', { error });
})

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if(!email || !password){
    req.flash("error", "email/password required");
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      req.flash("error", "register user before attempting login");
      return res.redirect('/users/register');
    }
    user.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        req.flash("error", "password verification failed");
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/');
    })
  })
})

router.get('/register', (req, res, next) => {
  let error = req.flash('error');
  res.render('register', { error });
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err){
      if(err.code === 11000){
        req.flash('error', 'the email is not unique');
        return res.redirect('/users/register');
      }
      if(err.name === 'ValidationError'){
        req.flash('error', 'the password should have more than 4 characters');
        return res.redirect('/users/register');
      }
      return res.json({ err });
    }
    res.redirect('/');
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect('/users');
})

module.exports = router;