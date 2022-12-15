const mongoose = require("mongoose");

// Original sneaker data will not be stored by us, the API will take care of that.
// However we will have to store the comments under each sneaker.
// To do that, we present the following schemas.

// A comments must be related to a particular user.
const commentSchema = mongoose.Schema(
  {
    user: {
      type: {
        _id: { type: String, required: true },
        name: { type: String, required: true },
      },
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const productSchema = mongoose.Schema({
  // This schema will allow us to save comments per unique sneaker _id.
  // Duplicate items get their own comment section.
  // A server request made renders this data.
  sneaks_id: { type: String, required: true, unique: true },
  product_comments: {
    type: [commentSchema],
  },
});


const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
