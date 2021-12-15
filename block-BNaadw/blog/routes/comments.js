let express = require('express');
let Article = require('../models/article');
let User = require('../models/user');
let Comment = require('../models/comment');

let router = express.Router();

router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Comment.findById(id).populate("articleId").exec((err, comment) => {
    if(err){
      return next(err);
    }
    res.render('editComment', { comment: comment });
  })
});

router.post('/:id', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if(err){
      return next(err);
    }
    Article.findById(updatedComment.articleId, (err, article) => {
      if(err){
        return next(err);
      }
      res.redirect('/articles/' + article.slug);
    })
  })
})

router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, updatedComment) => {
    if(err){
      return next(err);
    }
    Article.findById(updatedComment.articleId, (err, article) => {
      if(err){
        return next(err);
      }
      res.redirect('/articles/' + article.slug);
    });
  })
})

router.get('/:id/dislike', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, updatedComment) => {
    if(err){
      return next(err);
    }
    Article.findById(updatedComment.articleId, (err, article) => {
      if(err){
        return next(err);
      }
      res.redirect('/articles/' + article.slug);
    });
  })
})

router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, deletedComment) => {
    if(err){
      return next(err);
    }
    Article.findByIdAndUpdate(deletedComment.articleId, {$pull: {comments: deletedComment.id}} ,(err, article) => {
      if(err){
        return next(err);
      }
      res.redirect('/articles/' + article.slug);
    })
  })
})

module.exports = router;