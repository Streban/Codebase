const CampaignSegment = require('../models/campaignSegment.model');

const createCampaignSegment = async (data) => {
    return await CampaignSegment.create(data);
};

const getAllCampaignSegments = async (filter, options) => {
    options.populate = ['campaignId', 'segmentId'];
    return await CampaignSegment.paginate(filter, options);
};

const getCampaignSegmentById = async (id) => {

    return await CampaignSegment.findById(id).populate('campaignId').populate('segmentId');
};

const updateCampaignSegment = async (id, data) => {
    return await CampaignSegment.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteCampaignSegment = async (id) => {
    return await CampaignSegment.findByIdAndDelete(id);
};

module.exports = {
    createCampaignSegment,
    getAllCampaignSegments,
    getCampaignSegmentById,
    updateCampaignSegment,
    deleteCampaignSegment
};
