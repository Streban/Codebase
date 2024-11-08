const mongoose = require('mongoose');
const CampaignAnalytics = require('../../apis/models/campaignAnalytics.model');
const analyticsService = require('../../apis/controller/campaignAnalytics.controller');

jest.mock('../../apis/models/campaignAnalytics.model');

describe('CampaignAnalytics Service', () => {
    const analyticsData = {
        campaign: new mongoose.Types.ObjectId(),
        timeStamps: new Date(),
        opened: 0,
        clicked: 0,
        revenue: 0,
        booked: 0,
        bounce: 0,
        unsubscribes: 0
    };

    it('should create campaign analytics', async () => {
        CampaignAnalytics.create.mockResolvedValue(analyticsData);

        const createdAnalytics = await analyticsService.createAnalytics(analyticsData);

        expect(CampaignAnalytics.create).toHaveBeenCalledWith(analyticsData);
        expect(createdAnalytics).toEqual(analyticsData);
    });

    it('should retrieve analytics by ID', async () => {
        const _id = new mongoose.Types.ObjectId();
        CampaignAnalytics.findById.mockResolvedValue({ ...analyticsData, _id });

        const retrievedAnalytics = await analyticsService.getAnalyticsById(_id);

        expect(CampaignAnalytics.findById).toHaveBeenCalledWith(_id);
        expect(retrievedAnalytics).toHaveProperty('_id', _id);
    });

    it('should retrieve analytics by Campaign ID', async () => {
        const _id = new mongoose.Types.ObjectId();
        CampaignAnalytics.findOne.mockResolvedValue({ ...analyticsData, _id });

        const retrievedAnalytics = await analyticsService.getAnalyticsByCampignId(analyticsData.campaign);

        expect(CampaignAnalytics.findOne).toHaveBeenCalledWith({ campaign: analyticsData.campaign });
        expect(retrievedAnalytics).toHaveProperty('campaign', analyticsData.campaign);
    });

    it('should increment analytics fields', async () => {
        const _id = new mongoose.Types.ObjectId();
        const increments = { opened: 1, clicked: 1 };
        CampaignAnalytics.findByIdAndUpdate.mockResolvedValue({ ...analyticsData, ...increments });

        const updatedAnalytics = await analyticsService.incrementAnalytics(_id, increments);

        expect(CampaignAnalytics.findByIdAndUpdate).toHaveBeenCalledWith(_id, { $inc: increments }, { new: true });
        expect(updatedAnalytics.opened).toEqual(analyticsData.opened + increments.opened);
        expect(updatedAnalytics.clicked).toEqual(analyticsData.clicked + increments.clicked);
    });

    it('should delete campaign analytics', async () => {
        const _id = new mongoose.Types.ObjectId();
        CampaignAnalytics.findByIdAndDelete.mockResolvedValue({ _id });

        await analyticsService.deleteAnalytics(_id);

        expect(CampaignAnalytics.findByIdAndDelete).toHaveBeenCalledWith(_id);
    });

});
