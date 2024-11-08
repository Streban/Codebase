const app = require('../../../app')
const request = require('supertest')(app);
const Recipient = require('../../../apis/models/recipient.model');



const prefix_url = '/email_svc/pb/recipient'





const recipientObjects = [
    1, 2, 3, 4, 5
].map((i) => ({
    name: 'recipient Name' + i,
    email: 'test' + i + "@gmail.com",
}));

const singleRcipientObject = {
    name: 'single recipient Name',
    email: 'testname@gmail.com'
}

describe('Recipient API TEST CASES', () => {
    it('should create a new Recipient', async () => {
        const res = await request.post(prefix_url)
            .send(singleRcipientObject);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.name).toEqual(singleRcipientObject.name)
        expect(res.body.data.email).toEqual(singleRcipientObject.email)

    });


    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await Recipient.insertMany(recipientObjects);
        });
        afterAll(async () => {
            await Recipient.deleteMany({});
        });


        it('should retrieve all Recipients', async () => {
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

            const titles = response.body.data.docs.map(type => type.name);
            const sortedTitles = [...titles].sort();

            expect(titles).toEqual(sortedTitles);
        });


        it('filters the result set by Recipient name', async () => {
            const recipient = recipientObjects[0].name
            const response = await request.get(prefix_url)
                .query({ name: recipient })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.name).toEqual(recipient);
            });
        });


    });


    it('should retrieve a Recipient by ID', async () => {
        const result = await Recipient.create(singleRcipientObject)

        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toEqual(result._id.toString());
    });

    it('should update a Recipient', async () => {
        const result = await Recipient.create(singleRcipientObject)

        const res = await request.put(`${prefix_url}/${result._id}`)
            .send({
                name: 'Updated Recipient',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.name).toEqual('Updated Recipient');
    });

    it('should delete a Recipient', async () => {

        const result = await Recipient.create(singleRcipientObject)

        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find the Recipient after deletion', async () => {
        const result = await Recipient.create(singleRcipientObject)
        await request.delete(`${prefix_url}/${result._id}`);
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});

