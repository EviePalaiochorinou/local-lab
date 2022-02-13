const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 80,
  },
  description: {
    type: String,
    required: true,
    maxLength: 250,
  },
  images: [
    {
      title: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      }
    }
],
  lender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrower: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
