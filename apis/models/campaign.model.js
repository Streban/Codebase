const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // business: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Buisness',
    //     required: [true, 'Business must be required']
    // },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'emailTemplate',
        required: [true, 'Email Tempalte must be required']
    },
    segment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Segment',
        required: [true, 'Segment must be required']
    },
    businessId:{
        type: String,
        required: [true,'businessId is required']  // Unique business ID required
    },
    isExecuted:{
        type: Boolean,
        default: false
    },
    lastExecutedTime:{
        type: Date,
        default: null
    },
    startDate: {
        type: Date,
        required: false
    },
    endDate: {
        type: Date,
        required: false
    },
    isOneTime: { type: Boolean, default: false },
    isExpiredExecution: { type: Boolean, default: false},
    interval: { type: Number },
    intervalType: { type: String },
    isRecurring: {type: Boolean, default: false},
    description: {
        type: String
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CampaignType',
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        default: 'active'
    },
},{
    timestamps: true,
    versionKey: false  // To prevent version key from being added to the documents
});
campaignSchema.plugin(mongoosePaginate);

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
