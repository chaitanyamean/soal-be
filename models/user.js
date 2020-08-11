const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 12,
      unique: true,
      index: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "user"
    }
  },
  { timestamps: true }
);

// virtual fiels
// userSchema
//   .virtual("password")
//   .set(function(password) {
//     // Create temp variable called _password
//     this._password = password;

//     // encrypt password
//     this.hashed_password = this.encryptPassword(password);
//   })

//   .get(function() {
//     return this._password;
//   });
// userSchema.methods = {

//     authenticate: function(planeText){
//         this.encryptPassword(planeText) === this.hashed_password;
//     },

//   encryptPassword: function(password) {
//     if (!password) return "";
//     try {
//       return bcryptjs.hash(password, 10)
//     } catch (err) {
//       return "";
//     }
//   }
// };

// export user model
module.exports = mongoose.model('User', userSchema);