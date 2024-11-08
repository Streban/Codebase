const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");
const emailCred = new mongoose.Schema({
  auth: {
    user: { type: String, required: [true, "must not be empty"] },
    pass: { type: String, required: [true, "must not be empty"] },
  },
  server: { type: String, required: [true, "server is required"] },
  port: { type: Number, required: [true, "port is required"] },
  secure: { type: Boolean, default: false },
  primary:{type: Boolean},
  type: { type: String, enums: ["otp", "marketing"] },
  businessId: { type: String, ref:'Business', required:[true,'businessId is required'] },
  country: { type: String },
});

emailCred.plugin(mongoosePagination);
module.exports = mongoose.model("emailcredential", emailCred);
