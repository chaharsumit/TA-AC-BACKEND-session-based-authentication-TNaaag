let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let commentSchema = new Schema({
  comment: String,
  productId: { type: Schema.Types.ObjectId, ref: "Product" }
}, { timestamps: true });

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;