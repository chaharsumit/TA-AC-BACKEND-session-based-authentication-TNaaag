let express = require('express');
let Admin = require('../models/admin');
let User = require('../models/user');
let Product = require('../models/product');

let router = express.Router();

router.get('/register', (req, res, next) => {
  res.render('adminRegister');
})

router.get('/login', (req, res, next) => {
  res.render('adminLogin');
})

router.get('/dashboard', (req, res, next) => {
  Product.find({}, (err, products) => {
    if(err){
      return next(err);
    }
    res.render('dashboard', { products: products });
  })
})

router.post('/register', (req, res, next) => {
  Admin.create(req.body, (err, admin) => {
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    return res.redirect('/admin/login');
  }
  Admin.findOne({ email }, (err, admin) => {
    if(err){
      return next(err);
    }
    if(!admin){
      return res.redirect('/admin/register');
    }
    admin.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        return res.redirect('/admin/login');
      }
      req.session.adminId = admin.id;
      res.redirect('/admin/dashboard');
    })
  })
})

module.exports = router;