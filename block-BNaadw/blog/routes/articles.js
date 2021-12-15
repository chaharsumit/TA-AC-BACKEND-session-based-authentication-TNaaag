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
  Article.create(req.body, (err, article) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles');
  })
})

router.get('/new', (req, res, next) => {
  res.render('createArticle');
})

router.get('/:slug', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOne({ slug }).populate("comments").exec((err, article) => {
    if(err){
      return next(err);
    }
    res.render('articleDetails', { article: article });
  })
})

router.post('/:slug/comment', (req, res, next) => {
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
        res.redirect('/articles/' + updatedArticle.slug);
      })
    })
  })
})


// like/dislike

router.get('/:slug/like', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndUpdate({ slug }, {$inc: {likes: 1}}, (err, article) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + slug);
  })
})

router.get('/:slug/dislike', (req, res, next) => {
  let slug = req.params.slug;
  Article.findOneAndUpdate({ slug }, {$inc: {likes: -1}}, (err, article) => {
    if(err){
      return next(err);
    }
    res.redirect('/articles/' + slug);
  })
})

module.exports = router;