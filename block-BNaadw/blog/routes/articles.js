let express = require('express');
let Comment = require('../models/comment');
const Article = require('../models/article');

let router = express.Router();

router.get('/', (req, res, next) => {
  Article.find({}).populate("comments").exec((err, articles) => {
    if(err){
      return next(err);
    }
    res.render('articles', { articles });
  })
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
  Article.findOne({ slug }, (err, article) => {
    if(err){
      return next(err);
    }
    console.log(article);
    res.render('articleDetails', { article: article });
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