let express = require('express');
let Admin = require('../models/admin');
let User = require('../models/user');
let Product = require('../models/product');
let Comment = require('../models/comment');

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
  res.render('createProduct');
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
  Product.create(req.body, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/products');
  })
})

router.post('/comment/:id', (req, res, next) => {
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
      res.redirect('/products/' + id);
    })
  })
})

router.get('/comment/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if(err){
      return next(err);
    }
    res.render('editComment', { comment });
  })
})

router.get('/comment/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, deletedComment) => {
    if(err){
      return next(err);
    }
    Product.findByIdAndUpdate(deletedComment.productId, {$pull: {comments: id}}, (err, product) => {
      if(err){
        return next(err);
      }
      res.redirect('/products/' + deletedComment.productId);
    })
  })
})

//like
router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + id);
  });
})

//quantity
router.get('/:id/increaseQuantity', (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, {$inc: {quantity: 1}}, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + id);
  })
})

router.get('/:id/decreaseQuantity', (req, res, next) => {
  let id = req.params.id;
  Product.findByIdAndUpdate(id, {$inc: {quantity: -1}}, (err, product) => {
    if(err){
      return next(err);
    }
    res.redirect('/products/' + id);
  })
})


module.exports = router;