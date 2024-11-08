const Field = require('../../../apis/models/field.model');

const app = require('../../../app')
const request = require('supertest')(app);


const prefix_url = '/email_svc/pb/field'



const fieldsData = [{
    name: 'Example Field 1',
    businessId: 'someBusinessId1',
}, {
    name: 'Example Field 2',
    businessId: 'someBusinessId2',
}, {
    name: 'Example Field 3',
    businessId: 'someBusinessId2',
}]

const singleField = {
    name: 'Example Field',
    businessId: 'someBusinessId',
}

describe('Fields Apis Test Cases', () => {
    describe('POST /', () => {

        it('should create a new field and return it', async () => {
            const newFieldData = {
                name: 'Example Field',
                businessId: 'someBusinessId',
            };

            const response = await request.post(prefix_url)
                .send(newFieldData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.data.name).toEqual(newFieldData.name)
            expect(response.body.data.businessId).toEqual(newFieldData.businessId)
            expect(response.body.data).toHaveProperty('_id')
        });

    });
    describe('GET /', () => {
        beforeAll(async () => {
            await Field.insertMany(fieldsData);
        });
        afterAll(async () => {
            await Field.deleteMany({});
        });
        it('should get all fields base on filter condition', async () => {

            const response = await request.get(prefix_url)
                .query({ businessId: 'someBusinessId2' })
                .expect(200);

            expect(response.body.data.length).toEqual(2)
            expect(response.body.data[0]).toHaveProperty('_id')
        });
        it('should get all filds base', async () => {

            const response = await request.get(prefix_url)
                .expect(200);

            expect(response.body.data.length).toBeGreaterThan(2);

            expect(response.body.data[0]).toHaveProperty('_id')
        });

    });
    describe('PUT /', () => {

        it('should update a field and return it', async () => {

            const updatedFieldData = {
                name: 'updated Field',
            };

            const result = await Field.create(singleField)

            const response = await request.put(`${prefix_url}/${result._id}`)
                .send(updatedFieldData)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.data.name).toEqual(updatedFieldData.name)
            expect(response.body.data).toHaveProperty('_id')
        });

    });
    describe('DELETE /', () => {

        it('should update a field and return it', async () => {
            const result = await Field.create(singleField)

            const response = await request.delete(`${prefix_url}/${result._id}`)
                .expect(200);


            expect(response.body.message).toEqual('Removed successfully.')

        });

    });
});
