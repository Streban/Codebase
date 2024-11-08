const app = require('../../../app')
const request = require('supertest')(app);
const CampaignType = require('../../../apis/models/campaignType.model');



const prefix_url = '/email_svc/pb/campaign-type'

const campaignTypeData = [
    1, 2, 3, 4, 5
].map((i) => ({
    name: 'Test Campaign Type ' + i,
    description: 'This is a test description'
}));






const singleCampaignType = {
    name: 'Test Campaign Type',
    description: 'This is a test description'
}


describe('CampaignType API TEST CASES', () => {
    it('should create a new campaign type', async () => {
        const res = await request.post(prefix_url)
            .send(singleCampaignType);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
    });


    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await CampaignType.insertMany(campaignTypeData);
        });
        afterAll(async () => {
            await CampaignType.deleteMany({});
        });


        it('should retrieve all campaign types', async () => {
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
                .query({ sort: 'name', limit: 5 })
                .expect(200);

            const campaignTypes = response.body.data.docs.map(type => type.name);
            const sortedCampaignTypes = [...campaignTypes].sort();

            expect(campaignTypes).toEqual(sortedCampaignTypes);
        });


        it('filters the result set by name', async () => {
            const campaignTypeName = 'Test Campaign Type 2';
            const response = await request.get(prefix_url)
                .query({ name: campaignTypeName })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.name).toEqual(campaignTypeName);
            });
        });


    });


    it('should retrieve a campaign type by ID', async () => {
        const result = await CampaignType.create(singleCampaignType)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toEqual(result._id.toString());
    });

    it('should update a campaign type', async () => {
        const result = await CampaignType.create(singleCampaignType)
        const res = await request.put(`${prefix_url}/${result._id}`)
            .send({
                name: 'Updated Campaign Type 2',
                description: 'Updated description'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.name).toEqual('Updated Campaign Type 2');
    });

    it('should delete a campaign type', async () => {

        const result = await CampaignType.create(singleCampaignType)
        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find the campaign type after deletion', async () => {

        const result = await CampaignType.create(singleCampaignType)
        await CampaignType.findByIdAndDelete(result._id)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});






