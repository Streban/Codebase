const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");
const emailLog = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    emails: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
    },
    status: {
      type: String,
      enum: ["OK", "FAILED"]
    },
    messageId: { type: String },
    businessId: { type: String },
    template: String,
    shortCode: String,
    data: {},
  },
  {
    timestamps: true,
  }
);

emailLog.plugin(mongoosePagination);
module.exports = mongoose.model("emaillog", emailLog);
