const mongoose = require('mongoose');
const paginate = require("mongoose-paginate-v2");

const campaignActionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    sendDate: {
        type: Date,
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipient'
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Campaign'
    },
    business:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Business'
    },
    subject: {
        type: String,   
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'failed', 'queued'],
        required: true
    }
});
campaignActionSchema.plugin(paginate);

const CampaignAction = mongoose.model('CampaignAction', campaignActionSchema);

module.exports = CampaignAction;
