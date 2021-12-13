let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, 
  age: Number,
  phone: Number
}, { timestamps: true });

userSchema.pre("save", function(next){
  if(this.password && this.isModified('password')){
    bcrypt.hash(this.password, 10, (err, hashedValue) => {
      if(err){
        return next(err);
      }
      this.password = hashedValue;
      return next();
    });
  }else{
    next();
  }
});

let User = mongoose.model("User", userSchema);

module.exports = User;