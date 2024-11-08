const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const preferenceSchema = new Schema(
  {
    user: { type: String, required: false,  },
    email: { type: String, required: true,  },
    restricted:Boolean,
    shortCode:String,
    businessId:String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Preference", preferenceSchema);
