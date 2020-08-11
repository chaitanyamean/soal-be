const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    productId: {
      type: String
    },
    productName: {
      type: String
    },
    productDesc: {
      type: String
    },
    image: {
      url: String,
      key: String
    },
    price: {
      type: Number
    },
    categoryId: {
      type: String
    },
    brand: {
      type: String
    }
  },
  { timestamps: true }
);

// export user model
module.exports = mongoose.model('Products', userSchema);