const app = require('../../../app')
const mongoose = require('mongoose');
const request = require('supertest')(app);
const CampaignAction = require('../../../apis/models/campaignAction.model');



const prefix_url = '/email_svc/pb/campaign-action'



const campaignActionObjects = [
    1, 2, 3, 4, 5
].map((i) => ({
    email: 'test' + i + '@gmail.com',
    recipientId: new mongoose.Types.ObjectId(),
    sendDate: new Date(),
    body: 'A summer sale for all summer products.',
    campaignId: new mongoose.Types.ObjectId(),
    status: 'sent',
    subject: 'Test subject'
}));



const singleCampaignAction = {
    email: 'test@gmail.com',
    recipientId: new mongoose.Types.ObjectId(),
    sendDate: new Date(),
    body: 'A summer sale for all summer products.',
    campaignId: new mongoose.Types.ObjectId(),
    status: 'sent',
    subject: 'Test subject'
};

describe('Campaign Action API TEST CASES', () => {
    it('should create a new campaign Action', async () => {
        const res = await request.post(prefix_url).send(singleCampaignAction);
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.email).toEqual(singleCampaignAction.email);
        expect(res.body.data.status).toEqual(singleCampaignAction.status);
    });

    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await CampaignAction.insertMany(campaignActionObjects);
        });
        afterAll(async () => {
            await CampaignAction.deleteMany({});
        });

        it('should retrieve all campaigns Actions', async () => {
            const res = await request.get(prefix_url);
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toHaveProperty('docs');
            expect(Array.isArray(res.body.data.docs)).toBeTruthy();
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
                .query({ sort: 'email', limit: 5 })
                .expect(200);

            const campaignActions = response.body.data.docs.map(log => log.email);
            const sortedCampaignActions = [...campaignActions].sort();

            expect(campaignActions).toEqual(sortedCampaignActions);
        });

        it('filters the result set by name', async () => {
            const campaignActionEmail = campaignActionObjects[0].email
            const response = await request.get(prefix_url)
                .query({ email: campaignActionEmail })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.email).toEqual(campaignActionEmail);
            });
        });

        it('filters the result set by status', async () => {
            const status = 'sent';
            const response = await request.get(prefix_url)
                .query({ status: status })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.status).toEqual(status);
            });
        });
    });

    it('should retrieve a campaign Action by ID', async () => {
        const result = await CampaignAction.create(singleCampaignAction)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('_id', result._id.toString());
    });

    it('should update a campaign Action', async () => {
        const result = await CampaignAction.create(singleCampaignAction)

        const updatedData = { status: 'failed' };
        const res = await request.put(`${prefix_url}/${result._id}`).send(updatedData);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toEqual(updatedData.status);
    });

    it('should delete a campaign Action', async () => {
        const result = await CampaignAction.create(singleCampaignAction)

        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find the campaign Action after deletion', async () => {
        const result = await CampaignAction.create(singleCampaignAction)

        await request.delete(`${prefix_url}/${result._id}`);
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});
