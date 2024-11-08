const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const userPreferenceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      default: "emailSvc",
    },
    table_name: {
      type: String,
    },
    columnId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Table",
    },
    sticky: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      unique: true,
      default: 1,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
    },
    businessId: { type: String, required: [true, "businessId is required"] },
  },
  {
    timestamps: true,
  }
);

userPreferenceSchema.plugin(paginate);

module.exports = mongoose.model("UserPreference", userPreferenceSchema);
