let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
  comment: String,
  articleId: { type: Schema.Types.ObjectId, ref: "Article" }
}, { timestamps: true });

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;