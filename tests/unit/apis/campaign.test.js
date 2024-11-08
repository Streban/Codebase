const app = require('../../../app')
const mongoose = require('mongoose');
const request = require('supertest')(app);
const Campaign = require('../../../apis/models/campaign.model');



const prefix_url = '/email_svc/pb/campaign'



const campaignObjects = [
    1, 2, 3, 4, 5
].map((i) => ({
    name: 'Campaign Name' + i,
    business: new mongoose.Types.ObjectId(),
    startDate: new Date(),
    endDate: new Date(),
    description: 'A description of the campaign',
    typeId: new mongoose.Types.ObjectId(),
    status: 'active'
}));



const singleCampaign = {
    name: 'Single Campaign',
    business: new mongoose.Types.ObjectId(),
    startDate: new Date(),
    endDate: new Date(),
    description: 'A description of the single campaign',
    typeId: new mongoose.Types.ObjectId(),
    status: 'active'
};

describe('Campaign API TEST CASES', () => {
    it('should create a new campaign', async () => {
        const res = await request.post(prefix_url).send(singleCampaign);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toEqual(singleCampaign.name);
    });

    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await Campaign.insertMany(campaignObjects);
        });
        afterAll(async () => {
            await Campaign.deleteMany({});
        });

        it('should retrieve all campaigns', async () => {
            const res = await request.get(prefix_url);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('docs');
            expect(Array.isArray(res.body.docs)).toBeTruthy();
        });

        it('paginates the result set', async () => {
            const response = await request.get(prefix_url)
                .query({ page: 1, limit: 2 })
                .expect(200);
            expect(response.body.docs).toHaveLength(2);
            expect(response.body).toHaveProperty('totalDocs');
            expect(response.body).toHaveProperty('limit', 2);
            expect(response.body).toHaveProperty('page', 1);
        });

        it('sorts the result set', async () => {
            const response = await request.get(prefix_url)
                .query({ sort: 'name', limit: 5 })
                .expect(200);

            const campaign = response.body.docs.map(log => log.name);
            const sortedCampaigns = [...campaign].sort();

            expect(campaign).toEqual(sortedCampaigns);
        });

        it('filters the result set by name', async () => {
            const campaignName = 'Campaign Name 1';
            const response = await request.get(prefix_url)
                .query({ name: campaignName })
                .expect(200);

            response.body.docs.forEach(doc => {
                expect(doc.name).toEqual(campaignName);
            });
        });

        it('filters the result set by status', async () => {
            const status = 'active';
            const response = await request.get(prefix_url)
                .query({ status: status })
                .expect(200);

            response.body.docs.forEach(doc => {
                expect(doc.status).toEqual(status);
            });
        });
    });

    it('should retrieve a campaign by ID', async () => {


        const result = await Campaign.create(singleCampaign)

        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id', result._id.toString());
    });

    it('should update a campaign', async () => {
        const result = await Campaign.create(singleCampaign)

        const updatedData = { name: 'Updated Campaign Name' };
        const res = await request.put(`${prefix_url}/${result._id}`).send(updatedData);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual(updatedData.name);
    });

    it('should delete a campaign', async () => {
        const result = await Campaign.create(singleCampaign)
        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find the campaign after deletion', async () => {
        const result = await Campaign.create(singleCampaign)

        await request.delete(`${prefix_url}/${result._id}`);
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});
