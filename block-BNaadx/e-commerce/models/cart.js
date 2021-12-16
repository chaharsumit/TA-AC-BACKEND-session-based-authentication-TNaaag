let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let cartSchema = new Schema({
  productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }]
}, { timestamps: true });


let Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;