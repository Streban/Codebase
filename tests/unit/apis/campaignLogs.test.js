const app = require('../../../app')
const mongoose = require('mongoose');
const request = require('supertest')(app);
const CampaignLog = require('../../../apis/models/campaignLogs.model');



const prefix_url = '/email_svc/pb/campaign-log'


const campaignLogObjects = [
    'Pause', 'ended', 'started', 'canceld', 'rejected'
].map((item) => ({
    campaign: new mongoose.Types.ObjectId(),
    action: item,
    timestamps: new Date(),
    startDate: new Date('2024-03-20T10:00:00Z'),
    endDate: new Date('2024-04-20T10:00:00Z')
}));

const singleLog = {
    campaign: new mongoose.Types.ObjectId(),
    action: 'pending',
    timestamps: new Date(),
    startDate: new Date('2024-03-20T10:00:00Z'),
    endDate: new Date()
}


describe('Campaign Logs API TEST CASES', () => {
    it('should create a new campaign log', async () => {
        const res = await request.post(prefix_url)
            .send(singleLog);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.action).toEqual(singleLog.action)
    });


    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await CampaignLog.insertMany(campaignLogObjects);
        });
        afterAll(async () => {
            await CampaignLog.deleteMany({});
        });


        it('should retrieve all campaign logs', async () => {
            const check = 'Pause'
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
                .query({ sort: 'startDate', limit: 5 })
                .expect(200);

            const logs = response.body.data.docs.map(log => log.startDate);
            const sortedLogs = [...logs].sort();

            expect(logs).toEqual(sortedLogs);
        });



    });


    it('should retrieve a campaign log by ID', async () => {
        const result = await CampaignLog.create(singleLog)



        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toEqual(result._id.toString());
    });

    it('should update a campaign log', async () => {
        const result = await CampaignLog.create(singleLog)

        const res = await request.put(`${prefix_url}/${result._id}`)
            .send({
                action: 'updated Action',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.action).toEqual('updated Action');
    });

    it('should delete a campaign log', async () => {

        const result = await CampaignLog.create(singleLog)

        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find the campaign log after deletion', async () => {

        const result = await CampaignLog.create(singleLog)
        await CampaignLog.findByIdAndDelete(result._id)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});






