let express = require('express');
let Comment = require('../models/comment');
const Article = require('../models/article');

let router = express.Router();

router.get('/', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if(err){
      return next(err);
    }
    res.render('articles', { articles: articles });
  });
});

router.post('/', (req, res, next) => {
  if(req.session.userId){
    Article.create(req.body, (err, article) => {
      if(err){
        return next(err);
      }
      return res.redirect('/articles');
    })
  }else{
    res.render('info');
  }
})

router.get('/new', (req, res, next) => {
  if(req.session.userId){
    return res.render('createArticle');
  }else{
    res.render('info');
  }
})

router.get('/:slug', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne({ slug }).populate("comments").exec((err, article) => {
    if(err){
      return next(err);
    }
    return res.render('articleDetails', { article: article });
  })
})

router.post('/:slug/comment', (req, res, next) => {
  if(req.session.userId){
    let slug = req.params.slug;
    Comment.create(req.body, (err, comment) => {
      if(err){
        return next(err);
      }
      Article.findOneAndUpdate({ slug }, {$push: {comments: comment.id}}, (err, updatedArticle) => {
        if(err){
          return next(err);
        }
        Comment.findByIdAndUpdate(comment.id, { $push: {articleId: updatedArticle.id} } , (err, updateComment) => {
          if(err){
            return next(err);
          }
          return res.redirect('/articles/' + updatedArticle.slug);
        })
      })
    })
  }else{
    res.render('info');
  }
})


// like/dislike

router.get('/:slug/like', (req, res, next) => {
  if(req.session.userId){
    let slug = req.params.slug;
    Article.findOneAndUpdate({ slug }, {$inc: {likes: 1}}, (err, article) => {
      if(err){
        return next(err);
      }
      return res.redirect('/articles/' + slug);
    })
  }else{
    res.render('info');
  }
})

router.get('/:slug/dislike', (req, res, next) => {
  if(req.session.userId){
    let slug = req.params.slug;
    Article.findOneAndUpdate({ slug }, {$inc: {likes: -1}}, (err, article) => {
      if(err){
        return next(err);
      }
      return res.redirect('/articles/' + slug);
    })
  }else{
    res.render('info');
  }
})

module.exports = router;