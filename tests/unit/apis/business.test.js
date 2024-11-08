const Business = require('../../../apis/models/business.model');

const app = require('../../../app')
const request = require('supertest')(app);


const prefix_url = '/email_svc/pb/business'


const businessData = [
    1, 2, 3, 4, 5
].map((i) => ({
    name: 'Example Field' + i,
    businessId: 'someBusinessId' + i,
    accessKey: "some accessKey" + i
}));

const newBusinessData = {
    name: 'Example name',
    businessId: 'someBusinessId',
    accessKey: "some accessKey"
};

describe('business Apis Test Cases', () => {
    describe('POST /', () => {

        it('should create a new business and return it', async () => {

            const response = await request.post(prefix_url)
                .send(newBusinessData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.data.name).toEqual(newBusinessData.name)
            expect(response.body.data.businessId).toEqual(newBusinessData.businessId)
            expect(response.body.data).toHaveProperty('_id')
        });

        it('should throw Error when a new business if no business Id is provided with body', async () => {
            const newBusinessData = {
                name: 'Example name',
                accessKey: "some accessKey"
            };

            const response = await request.post(prefix_url)
                .send(newBusinessData)
            expect(response.body).toHaveProperty('error')
        });

    });

    describe('Paginate and get All business', () => {
        beforeAll(async () => {
            await Business.insertMany(businessData);
        });
        afterAll(async () => {
            await Business.deleteMany({});
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

            const titles = response.body.data.docs.map(bus => bus.name);
            const sortedTitles = [...titles].sort();

            expect(titles).toEqual(sortedTitles);
        });


        it('filters the result set by businessId', async () => {
            const testBusinessId = 'business1';
            const response = await request.get(prefix_url)
                .query({ businessId: testBusinessId })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.businessId).toEqual(testBusinessId);
            });
        });
    });


    describe('PUT /', () => {

        it('should update a business and return it', async () => {


            const result = await Business.create(newBusinessData)


            const updatedFieldData = {
                name: 'updated name',
            };
            const response = await request.put(`${prefix_url}/${result._id}`)
                .send(updatedFieldData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.data.name).toEqual(updatedFieldData.name)
            expect(response.body.data).toHaveProperty('_id')
        });

    });


    describe('DELETE /', () => {
        it('should DELETE a Business and return it', async () => {

            const result = await Business.create(newBusinessData)
            const response = await request.delete(`${prefix_url}/${result._id}`)
                .expect(200);
            expect(response.body.message).toEqual('Email business deleted successfully.')

        });

    });

});
