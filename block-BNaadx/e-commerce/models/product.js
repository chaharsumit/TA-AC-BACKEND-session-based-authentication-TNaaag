let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let productSchema = new Schema({
  name: String,
  quantity:{ type: Number, default: 0 },
  price: Number,
  image: String,
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });

let Product = mongoose.model("Product", productSchema);

module.exports = Product;