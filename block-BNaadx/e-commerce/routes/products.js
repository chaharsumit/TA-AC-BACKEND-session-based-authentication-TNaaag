let express = require('express');
let Admin = require('../models/admin');
let User = require('../models/user');
let Product = require('../models/product');
let Comment = require('../models/comment');
let Cart = require('../models/cart');

let router = express.Router();

router.get('/', (req, res, next) => {
  Product.find({}).populate("comments").exec((err, products) => {
    if(err){
      return next(err);
    }
    res.render('product', { products: products });
  })
})

router.get('/new', (req, res, next) => {
  if(req.session && req.session.adminId){
    return res.render('createProduct');
  }else{
    res.redirect('/admin/login');
  }
})

router.get('/cart', (req, res, next) => {
  Cart.findOne({}).populate("productIds").exec((err, cart) => {
    if(err){
      return next(err);
    }
    res.render('cart', { productsList: cart.productIds });
  })
})

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Product.findById(id).populate('comments').exec((err, product) => {
    if(err){
      return next(err);
    }
    res.render('productDetails', { product });
  })
})

router.post('/', (req, res, next) => {
  if(req.session && req.session.adminId){
    Product.create(req.body, (err, product) => {
      if(err){
        return next(err);
      }
      return res.redirect('/products');
    })
  }else{
    res.redirect('/admin/login');
  }
})

router.post('/comment/:id', (req, res, next) => {
  if(req.session && req.session.userId){
    let id = req.params.id;
    req.body.productId = id;
    Comment.create(req.body, (err, comment) => {
      if(err){
        return next(err);
      }
      Product.findByIdAndUpdate(id, {$push: {comments: comment.id}}, (err, product) => {
        if(err){
          return next(err);
        }
        return res.redirect('/products/' + id);
      })
    })
  }else{
    res.redirect('/users/login');
  } 
})

router.get('/comment/:id/edit', (req, res, next) => {
  if(req.session && req.session.userId){
    let id = req.params.id;
    Comment.findById(id, (err, comment) => {
      if(err){
        return next(err);
      }
      return res.render('editComment', { comment });
    })
  }else{
    res.redirect('/users/login');
  }
})

router.get('/comment/:id/delete', (req, res, next) => {
  if(req.session && req.session.userId){
    let id = req.params.id;
    Comment.findByIdAndDelete(id, (err, deletedComment) => {
      if(err){
        return next(err);
      }
      Product.findByIdAndUpdate(deletedComment.productId, {$pull: {comments: id}}, (err, product) => {
        if(err){
          return next(err);
        }
        return res.redirect('/products/' + deletedComment.productId);
      })
    })
  }else{
    res.redirect('/users/login');
  }
})

router.get('/:id/cart/add', (req, res, next) => {
  if(req.session && req.session.userId){
    let id = req.params.id;
    req.body.productIds = id;
    Cart.create(req.body, (err, cart) => {
      if(err){
        return next(err);
      }
      return res.redirect('/products/' + id);
    });
  }else{
    res.redirect('/admin/login');
  }
})

//edit product

router.get('/:id/edit', (req, res, next) => {
  if(req.session && req.session.adminId){
    let id = req.params.id;
    Product.findById(id, (err, product) => {
      if(err){
        return next(err);
      }
      return res.render('editProduct', { product: product });
    })
  }else{
    res.redirect('/admin/login');
  }
})

router.post('/:id/edit', (req, res, next) => {
  if(req.session && req.session.adminId){
    let id = req.params.id;
    Product.findByIdAndUpdate(id, req.body, (err, product) => {
      if(err){
        return next(err);
      }
      return res.redirect('/admin/dashboard');
    });
  }else{
    res.redirect('/admin/login');
  }
})

router.get('/:id/delete', (req, res, next) => {
  if(req.session && req.session.adminId){
    let id = req.params.id;
    Product.findByIdAndDelete(id, (err, deletedProduct) => {
      if(err){
        return next(err);
      }
      Comment.deleteMany({$exists: {productId: deletedProduct.id}}, (err, deletedComments) => {
        if(err){
          return next(err);
        }
        return res.redirect('/admin/dashboard');
      })
    })
  }else{
    res.redirect('/admin/login');
  }
})

//like
router.get('/:id/like', (req, res, next) => {
  if(req.session && req.session.userId){
    let id = req.params.id;
    Product.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, product) => {
      if(err){
        return next(err);
      }
      return res.redirect('/products/' + id);
    });
  }else{
    res.redirect('/users/login');
  }
})

//quantity
router.get('/:id/increaseQuantity', (req, res, next) => {
  if(req.session && req.session.userId){
    let id = req.params.id;
    Product.findByIdAndUpdate(id, {$inc: {quantity: 1}}, (err, product) => {
      if(err){
        return next(err);
      }
      return res.redirect('/products/' + id);
    })
  }else{
    res.redirect('/users/login');
  }
})

router.get('/:id/decreaseQuantity', (req, res, next) => {
  if(req.session && req.session.userId){
    let id = req.params.id;
    Product.findByIdAndUpdate(id, {$inc: {quantity: -1}}, (err, product) => {
      if(err){
        return next(err);
      }
      res.redirect('/products/' + id);
    })
  }else{
    res.redirect('/users/login');
  }
})


module.exports = router;