const CampaignType = require('../models/campaignType.model');

const createCampaignType = async (data) => {
    const campaignType = await CampaignType.create(data);
    return campaignType;
};

const getAllCampaignTypes = async (filter, options) => {
    const campaignTypes = await CampaignType.paginate(filter, options);
    return campaignTypes;
};

const getCampaignTypeById = async (id) => {
    const campaignType = await CampaignType.findById(id);
    return campaignType;
};

const updateCampaignType = async (id, data) => {
    const updatedCampaignType = await CampaignType.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
    return updatedCampaignType;
};

const deleteCampaignType = async (id) => {
    await CampaignType.findByIdAndDelete(id);
};

module.exports = {
    createCampaignType,
    getAllCampaignTypes,
    getCampaignTypeById,
    updateCampaignType,
    deleteCampaignType
};
