const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const businessSchema = new mongoose.Schema({
  name: { type: String },
  businessId: { type: String, required: [true, "businessId is required"], unique: true },
  accessKey: { type: String },
  balance: {type: Number},
  perMessageRate: { type: Number, required: [false, "perMessageRate is required"] },
});

businessSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Buisness", businessSchema);
