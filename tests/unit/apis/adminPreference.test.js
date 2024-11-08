const AdminPreference = require('../../../apis/models/adminPreference');

const app = require('../../../app')
const request = require('supertest')(app);

const { dummyAdminPreferences, singlleAdminPreference } = require('./testData/admin.preference')

const prefix_url = '/email_svc/pb/preference-admin'
describe('Admin Prefernce Apis Test Cases', () => {
    describe('POST /', () => {
        it('should create a new admin preference and return it', async () => {
            const newAdminPreference = singlleAdminPreference

            const response = await request.post(prefix_url)
                .send(newAdminPreference)
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body.data.columnId).toEqual(newAdminPreference.columnId)
            expect(response.body.data.column_name).toEqual(newAdminPreference.column_name)
            expect(response.body.data.businessId).toEqual(newAdminPreference.businessId)
            expect(response.body.data).toHaveProperty('_id')
        });


    });

    describe('Paginate and get All Admin Preferences', () => {
        beforeAll(async () => {
            await AdminPreference.insertMany(dummyAdminPreferences);
        });
        afterAll(async () => {
            await AdminPreference.deleteMany({});
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
                .query({ sort: 'table_name', limit: 5 })
                .expect(200);

            const titles = response.body.data.docs.map(pref => pref.table_name);
            const sortedTitles = [...titles].sort();

            expect(titles).toEqual(sortedTitles);
        });


        it('filters the result set by table_name', async () => {
            const table_name = 'customers';
            const response = await request.get(prefix_url)
                .query({ table_name: table_name })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.table_name).toEqual(table_name);
            });
        });



    });

    describe('PUT /', () => {
        beforeAll(async () => {
            await AdminPreference.deleteMany({});
        });
        it('should update a admin preference and return it', async () => {
            const newAdminPreference = dummyAdminPreferences[0]
            const result = await AdminPreference.create(newAdminPreference)
            const updatedFieldData = {
                table_name: 'updated table_name',
            };
            const response = await request.put(`${prefix_url}/${result._id}`)
                .send(updatedFieldData)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.data.table_name).toEqual(updatedFieldData.table_name)
            expect(response.body.data).toHaveProperty('_id')
        });

    });
    describe('DELETE /', () => {
        beforeAll(async () => {
            await AdminPreference.deleteMany({});
        });
        it('should update a admin Preference and return it', async () => {
            const newAdminPreference = dummyAdminPreferences[0]

            const result = await AdminPreference.create(newAdminPreference)

            const response = await request.delete(`${prefix_url}/${result._id}`)
                .expect(200);
            expect(response.body.message).toEqual('Preference deleted successfully.')

        });

    });

});