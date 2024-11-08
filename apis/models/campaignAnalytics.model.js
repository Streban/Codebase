const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    opened: {
        type: Number,
        default: 0
    },
    clicked: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    },
    booked: {
        type: Number,
        default: 0
    },
    bounce: {
        type: Number,
        default: 0
    },
    unsubscribes: {
        type: Number,
        default: 0
    },
    subscribe:{
        type: Number,
        default: 0
    }
},{
    timestamps: true,
    versionKey: false,
    
});

const CampaignAnalytics = mongoose.model('CampaignAnalytics', analyticsSchema);

module.exports = CampaignAnalytics;
