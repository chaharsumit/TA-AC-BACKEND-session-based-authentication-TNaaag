let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password : { type: String, required: true }
}, { timestamps: true });

adminSchema.pre("save", function(next){
  if(this.password && this.isModified("password")){
    bcrypt.hash(this.password, 10, (err, hashedValue) => {
      if(err){
        return next(err);
      }
      this.password = hashedValue;
      return next();
    })
  }else{
    next();
  }
})

adminSchema.methods.verifyPassword = function(password, cb){
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  })
}

let Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;