var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('user');
});

router.get('/login', (req, res, next) => {
  let error = req.flash("error");
  res.render('login', { error });
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    req.flash("error", "email/password required");
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      req.flash('error', "user is not registered");
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        req.flash('error', 'password did not match try again');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users');
    });
  })
})

router.get('/register', (req, res, next) => {
  let error  = req.flash("error");
  res.render('register', { error });
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err){
      if(err.code === 11000){
        req.flash("error", "email entered is already taken");
        return res.redirect('/users/register');
      }
      if(err.name === "ValidationError"){
        req.flash("error", "the password must be having at least 5 characters");
        return res.redirect('/users/register');
      }
    }
    res.redirect('/users/login');
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
})

module.exports = router;