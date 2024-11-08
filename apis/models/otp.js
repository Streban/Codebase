const mongoose = require("mongoose");
// const mongoosePagination = require("mongoose-paginate-v2");
const otpSchema = new mongoose.Schema({
  otpCode: {
    type: String,
  },
  user: {
    type: String,
  },
  lastUpdatedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "verified", "expired", "failed"],
  },
});

module.exports = mongoose.model("otp", otpSchema);
