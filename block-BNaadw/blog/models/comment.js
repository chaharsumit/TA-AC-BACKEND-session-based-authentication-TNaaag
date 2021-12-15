let mongoose = require('mongoose');
let Article = require('./article');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
  name: String,
  comment: String,
  articleId: { type: Schema.Types.ObjectId, ref: "Article" }
}, { timestamps: true });

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;