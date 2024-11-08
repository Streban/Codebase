const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");
const userEmailSetting = new mongoose.Schema({
  user: {
    type: String,
  },
  email: {
    type: String,
  },
  setting: {},
  businessId:{type:String, required: [true,'businessId is required']}
});

userEmailSetting.plugin(mongoosePagination);
module.exports = mongoose.model("useremailsetting", userEmailSetting);
