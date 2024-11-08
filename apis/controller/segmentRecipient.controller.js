const SegmentRecipient = require('../models/segmentRecipient.model');

const createSegmentRecipient = async (data) => {
    return await SegmentRecipient.create(data);
};

const getAllSegmentRecipients = async (filter, options) => {
    options.populate = ['segmentId', 'recipientId'];
    return await SegmentRecipient.paginate(filter, options);
};

const getSegmentRecipientById = async (id) => {
    return await SegmentRecipient.findById(id).populate('segmentId', 'recipientId')
};


const getSegmentRecipientBySegmentId = async (id) => {
    return await SegmentRecipient.find({ segmentId: id }).populate('segmentId').populate('recipientId')
};
const getSegmentRecipientByrecipientId = async (id) => {
    return await SegmentRecipient.find({ recipientId: id }).populate('segmentId').populate('recipientId')
};

const updateSegmentRecipient = async (id, data) => {
    return await SegmentRecipient.findByIdAndUpdate(id, data, { new: true });
};

const deleteSegmentRecipient = async (id) => {
    return await SegmentRecipient.findByIdAndDelete(id);
};

module.exports = {
    createSegmentRecipient,
    getAllSegmentRecipients,
    getSegmentRecipientById,
    updateSegmentRecipient,
    deleteSegmentRecipient, getSegmentRecipientBySegmentId, getSegmentRecipientByrecipientId
};
