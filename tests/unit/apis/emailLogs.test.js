const app = require('../../../app')
const request = require('supertest')(app);

const EmailLog = require("../../../apis/models/emaillog");



const emailLogs = [
    { user: 'user1', emails: ['email1@example.com'], shortCode: "TEST", status: 'OK', type: 'Notification', businessId: 'biz1' },
    { user: 'user2', emails: ['email2@example.com'], shortCode: 'WELCOME', status: 'OK', type: 'Alert', businessId: 'biz2' },
    { user: 'user3', emails: ['email3@example.com'], shortCode: "TEST CASE", status: 'OK', type: 'main', businessId: 'biz3' },
];


const prefix_url = '/email_svc/pb/logs'


describe('EmailLog Function Tests', () => {
    describe('Paginate and get All Email Logs', () => {
        beforeAll(async () => {
            await EmailLog.insertMany(emailLogs);
        });
        afterAll(async () => {
            await EmailLog.deleteMany({});
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
                .query({ sort: 'title', limit: 5 })
                .expect(200);

            const titles = response.body.data.docs.map(template => template.title);
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

        it('filters the result set by shortCode', async () => {
            const shortCode = 'WELCOME';
            const response = await request.get(prefix_url)
                .query({ shortCode: shortCode })
                .expect(200);

            console.log(response.body.data);

            expect(response.body.data.docs[0].shortCode).toEqual(shortCode);
        });

    });

    describe('EmailLog Search Function Tests', () => {
        beforeAll(async () => {
            await EmailLog.insertMany(emailLogs);
        });

        afterAll(async () => {
            await EmailLog.deleteMany({});
        });

        it('searches email logs by email address', async () => {
            const searchQuery = 'email1@example.com';
            const response = await request.get(`${prefix_url}/search`)
                .query({ search: searchQuery, page: 1 })
                .expect(200);

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].emails).toContain(searchQuery);
            expect(response.body).toHaveProperty('totalDocs', 1);
            expect(response.body).toHaveProperty('limit', 10);
            expect(response.body).toHaveProperty('page', 1);
        });

        it('paginates the search result set', async () => {
            const searchQuery = 'email';
            const response = await request.get(`${prefix_url}/search`)
                .query({ search: searchQuery, page: 1, limit: 2 })
                .expect(200);


            expect(response.body.data).toHaveLength(3);
            expect(response.body).toHaveProperty('totalDocs');
            expect(response.body).toHaveProperty('limit', 10);
            expect(response.body).toHaveProperty('page', 1);
        });

        it('returns empty result set for unmatched search', async () => {
            const searchQuery = 'nonexistent@example.com';
            const response = await request.get(`${prefix_url}/search`)
                .query({ search: searchQuery, page: 1 })
                .expect(200);

            expect(response.body.data).toHaveLength(0);
            expect(response.body).toHaveProperty('totalDocs', 0);
        });
    });



});
