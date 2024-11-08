const CampaignLog = require('../models/campaignLogs.model');

const createCampaignLog = async (data) => {
    return await CampaignLog.create(data);
};

const getAllCampaignLogs = async (filter, options) => {
    return await CampaignLog.paginate(filter, options);
};

const getCampaignLogById = async (id) => {
    return await CampaignLog.findById(id);
};

const updateCampaignLog = async (id, data) => {
    return await CampaignLog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteCampaignLog = async (id) => {
    return await CampaignLog.findByIdAndDelete(id);
};

module.exports = {
    createCampaignLog,
    getAllCampaignLogs,
    getCampaignLogById,
    updateCampaignLog,
    deleteCampaignLog
};
