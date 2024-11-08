const CampaignAction = require('../models/campaignAction.model');

const createAction = async (data) => {
    return await CampaignAction.create(data);
};

const getAllActions = async (filters, options) => {
    options.populate = ['recipientId', 'campaignId']
    return await CampaignAction.paginate(filters, options)
};

const getActionById = async (id) => {
    return await CampaignAction.findById(id).populate('recipientId', 'campaignId')
};


const updateAction = async (id, data) => {
    return await CampaignAction.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteAction = async (id) => {
    return await CampaignAction.findByIdAndDelete(id);
};

module.exports = {
    createAction,
    getAllActions,
    getActionById,
    updateAction,
    deleteAction
};
