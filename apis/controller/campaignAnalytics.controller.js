const CampaignAnalytics = require('../models/campaignAnalytics.model');
const {ObjectId} = require('mongodb')

const createAnalytics = async (data) => {
    return await CampaignAnalytics.create(data);
};


const getAnalyticsById = async (id) => {
    return await CampaignAnalytics.findById(id);
};
const getAnalyticsByCampignId = async (id) => {
    return await CampaignAnalytics.findOne({ campaign: new ObjectId(id) })
};

const incrementAnalytics = async (id, fieldsToUpdate) => {
    return await CampaignAnalytics.findOneAndUpdate(
        {campaign:id},
        { $inc: fieldsToUpdate },
        { new: true }
    );
};

const decrementAnalytics = async (id, fieldsToUpdate) => {
    return await CampaignAnalytics.findByIdAndUpdate(
        id,
        { $inc: fieldsToUpdate * -1 },
        { new: true }
    );
};

const deleteAnalytics = async (id) => {
    return await CampaignAnalytics.findByIdAndDelete(id);
};

module.exports = {
    createAnalytics,
    getAnalyticsById,
    incrementAnalytics,
    decrementAnalytics,
    deleteAnalytics,
    getAnalyticsByCampignId
};
