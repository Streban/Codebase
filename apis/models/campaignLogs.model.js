const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { CAMPAIGN_STATUSES: CAMPAIGN_ERRORS } = require("../../constants");

const campaignLogSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    status: { type: String },
    messageId: { type: String },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    error: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: Object.values(CAMPAIGN_ERRORS),
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
campaignLogSchema.plugin(mongoosePaginate);

const CampaignLog = mongoose.model("CampaignLog", campaignLogSchema);

module.exports = CampaignLog;
