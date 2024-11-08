const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const campaignSegmentSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    segmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Segment',
        required: true
    },
    assignDate: {
        type: Date,
        default: Date.now
    }
});
campaignSegmentSchema.plugin(mongoosePaginate);

const CampaignSegment = mongoose.model('CampaignSegment', campaignSegmentSchema);


module.exports = CampaignSegment;
