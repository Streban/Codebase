const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const campaignTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
});
campaignTypeSchema.plugin(mongoosePaginate);

const CampaignType = mongoose.model('CampaignType', campaignTypeSchema);

module.exports = CampaignType;
