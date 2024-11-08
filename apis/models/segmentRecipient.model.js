const mongoose = require('mongoose');
const mongoosePagination = require("mongoose-paginate-v2");

const segmentRecipientSchema = new mongoose.Schema({
    segmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Segment',
        required: true
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipient',
        required: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
});
segmentRecipientSchema.plugin(mongoosePagination);

const SegmentRecipient = mongoose.model('SegmentRecipient', segmentRecipientSchema);

module.exports = SegmentRecipient;
