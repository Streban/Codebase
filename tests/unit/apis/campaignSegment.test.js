const app = require('../../../app')
const request = require('supertest')(app);
const CampaignSegment = require('../../../apis/models/campaignSegment.model')
const mongoose = require('mongoose');



const prefix_url = '/email_svc/pb/campaign-segment'

const campaignSegmentObjects = [
    1, 2, 3, 4, 5
].map(() => ({
    campaignId: new mongoose.Types.ObjectId(), segmentId: new mongoose.Types.ObjectId(), assignDate: new Date()
}));

const singleCampaignSegment = { campaignId: new mongoose.Types.ObjectId(), segmentId: new mongoose.Types.ObjectId(), assignDate: new Date() }

describe('Campaign segments API TEST CASES', () => {
    it('should create a new campaign segments', async () => {
        const res = await request.post(prefix_url)
            .send(singleCampaignSegment);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('campaignId');
        expect(res.body.data.campaignId).toEqual(singleCampaignSegment.campaignId.toString());
        expect(res.body.data.segmentId).toEqual(singleCampaignSegment.segmentId.toString());
    });


    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await CampaignSegment.insertMany(campaignSegmentObjects);
        });
        afterAll(async () => {
            await CampaignSegment.deleteMany({});
        });


        it('should retrieve all campaign segments', async () => {
            const res = await request.get(prefix_url)
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('data');
        });

        it('paginates the result set', async () => {
            const response = await request.get(prefix_url)
                .query({ page: 1, limit: 2 })
                .expect(200);
            expect(response.body.data.docs).toHaveLength(2);
            expect(response.body.data).toHaveProperty('totalDocs');
            expect(response.body.data).toHaveProperty('limit', 2);
            expect(response.body.data).toHaveProperty('page', 1);
        });


        it('sorts the result set', async () => {
            const response = await request.get(prefix_url)
                .query({ sort: 'campaignId', limit: 5 })
                .expect(200);

            const campaignSegs = response.body.data.docs.map(type => type.campaignId);
            const sortedcampaignSegs = [...campaignSegs].sort();

            expect(campaignSegs).toEqual(sortedcampaignSegs);
        });

    });


    it('should retrieve a campaign segment by ID', async () => {
        const result = await CampaignSegment.create(singleCampaignSegment)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toEqual(result._id.toString());
    });

    it('should update a campaign segment', async () => {

        const result = await CampaignSegment.create(singleCampaignSegment)
        const newSegmentId = new mongoose.Types.ObjectId

        const res = await request.put(`${prefix_url}/${result._id}`)
            .send({
                campaignId: newSegmentId
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.campaignId.toString()).toEqual(newSegmentId.toString());
    });

    it('should delete a campaign segment', async () => {


        const result = await CampaignSegment.create(singleCampaignSegment)
        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find the campaign segment after deletion', async () => {
        const result = await CampaignSegment.create(singleCampaignSegment)
        await CampaignSegment.findByIdAndDelete(result._id)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});






