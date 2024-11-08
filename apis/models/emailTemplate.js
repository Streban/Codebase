const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const emailTemplate = new mongoose.Schema({
  title: {
    type: String,
  },
  fields: [
    {
      type: String,
    },
  ],
  template: {
    type:String
  },
  businessId:{type:String, required: [true,'businessId is required'] },
  shortCode: { type: String, unique: true },
  type: { type: String },
});

emailTemplate.plugin(mongoosePaginate);

module.exports = mongoose.model("emailTemplate", emailTemplate);
