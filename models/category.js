const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    categoryId: {
      type: String
    },
    categoryName: {
      type: String
    }
  },
  { timestamps: true }
);

// export category model
module.exports = mongoose.model('Category', userSchema);