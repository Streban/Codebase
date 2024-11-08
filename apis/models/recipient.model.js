const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const recipientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
  },
  country: {
    type: String,
  },
  subscriptionStatus: {
    type: String,
    enum: ["subscribed", "unsubscribed"],
    default: "subscribed",
  },
  segments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Segment",
    },
  ],
});
recipientSchema.plugin(mongoosePagination);

const Recipient = mongoose.model("Recipient", recipientSchema);

module.exports = Recipient;
