const app = require('../../../app')
const mongoose = require('mongoose');
const request = require('supertest')(app);
const CampaignAnalytics = require('../../../apis/models/campaignAnalytics.model');

const prefix_url = '/email_svc/pb/campaign-analytics'
describe('Analytics API Endpoints', () => {
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
        const response = await request.post(prefix_url)
            .send(analyticsData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
    });

    it('should get campaign analytics by ID', async () => {
        const result = await CampaignAnalytics.create(analyticsData)

        const response = await request.get(`${prefix_url}/${result._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id', result._id.toString());
    });

    it('should get campaign analytics by Campaign ID', async () => {
        const result = await CampaignAnalytics.create(analyticsData)
        const response = await request.get(`${prefix_url}/campaign/${result.campaign}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('campaign', result.campaign.toString());
    });

    it('should increment analytics fields', async () => {
        const result = await CampaignAnalytics.create(analyticsData)
        const increments = { opened: 1, clicked: 1 };
        const response = await request.put(`${prefix_url}/${result._id.toString()}`)
            .send(increments);

        expect(response.statusCode).toBe(200);
        expect(response.body.opened).toBe(result.opened + increments.opened);
        expect(response.body.clicked).toBe(result.clicked + increments.clicked);
    });

    it('should delete campaign analytics', async () => {
        const result = await CampaignAnalytics.create(analyticsData)
        const response = await request.delete(`${prefix_url}/${result._id}`);
        expect(response.statusCode).toBe(204);
    });

});
