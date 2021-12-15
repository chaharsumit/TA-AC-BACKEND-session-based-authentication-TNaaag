let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: String
}, { timestamps: true });

// str.toLowerCase().split(' ').join('-')

let User = mongoose.model('User', userSchema);

module.exports = User;