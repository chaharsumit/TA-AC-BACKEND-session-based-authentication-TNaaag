let express = require('express');
let Admin = require('../models/admin');
let User = require('../models/user');
let Comment = require('../models/comment');
let router = express.Router();

router.get('/register', (req, res, next) => {
  res.render('userRegister');
})

router.get('/login', (req, res, next) => {
  res.render('userLogin');
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      return res.redirect('/users/register');
    }
    user.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.render('loginSuccess');
    })
  })
})

module.exports = router;