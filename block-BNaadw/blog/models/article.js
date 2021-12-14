let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: String,
  description: String,
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  author: String,
  slug: String
}, { timestamps: true });

let Article = mongoose.model('Article', articleSchema);

module.exports = Article;