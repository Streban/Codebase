const app = require('../../../app')
const request = require('supertest')(app);

describe('GET /health-check', () => {
    it('responds with OK message', async () => {

        const response = await request.get('/email_svc/pb/health-check');
        expect(response.status).toBe(200);
        expect(response.text).toEqual('OK');
    });


    it('generates and returns 10,000 email addresses', async () => {
        const response = await request
            .get('/generate_mails')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.length).toBe(10000);

        expect(response.body[0]).toEqual('a0@yopmail.com');
        expect(response.body[9999]).toEqual('a9999@yopmail.com');
    });



});
