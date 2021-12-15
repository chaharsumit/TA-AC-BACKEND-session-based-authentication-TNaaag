let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Comment = require('./comment');
let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: String,
  description: String,
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author: String,
  slug: { type: String, unique: true }
}, { timestamps: true });

articleSchema.pre("save", function(next){
  this.slug = this.title;
  this.slug = this.slug.toLowerCase().split(' ').join("-");
  next();
})

let Article = mongoose.model('Article', articleSchema);

module.exports = Article;