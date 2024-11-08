const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const adminPreference = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      default: "emailSvc",
    },
    table_name: {
      type: String,
    },
    column_name: {
      type: String,
      default: "first_name",
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

adminPreference.plugin(paginate);
adminPreference.index("columnId");

module.exports = mongoose.model("AdminPreference", adminPreference);
