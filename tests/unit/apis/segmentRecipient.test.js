const app = require('../../../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const SegmentRecipient = require('../../../apis/models/segmentRecipient.model');

const prefix_url = '/email_svc/pb/segment-recipient';



const campaignObjects = [
    1, 2, 3, 4, 5
].map(() => ({
    segmentId: new mongoose.Types.ObjectId(),
    recipientId: new mongoose.Types.ObjectId(),
    joinDate: new Date()
}));
const singleSegmentRecipient = {
    segmentId: new mongoose.Types.ObjectId(),
    recipientId: new mongoose.Types.ObjectId(),
    joinDate: new Date()
}



describe('SegmentRecipient API TEST CASES', () => {
    it('should create a new segment recipient', async () => {

        const res = await request.post(prefix_url).send(singleSegmentRecipient);
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toHaveProperty('_id');

    });


    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await SegmentRecipient.insertMany(campaignObjects)
        });

        afterAll(async () => {
            await SegmentRecipient.deleteMany({});
        });


        it('should retrieve all segment recipient', async () => {
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


    });

    it('should retrieve a segment recipient by ID', async () => {
        const result = await SegmentRecipient.create(singleSegmentRecipient)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('_id', result._id.toString());
    });

    it('should retrieve segment recipients by segment ID', async () => {
        const result = await SegmentRecipient.create(singleSegmentRecipient)

        const res = await request.get(`${prefix_url}/segment/${result.segmentId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.some(sr => sr._id === result._id.toString())).toBeTruthy();
    });

    it('should retrieve segment recipients by recipient ID', async () => {
        const result = await SegmentRecipient.create(singleSegmentRecipient)

        const res = await request.get(`${prefix_url}/recipient/${result.recipientId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.some(sr => sr._id === result._id.toString())).toBeTruthy();
    });

    it('should update a segment recipient', async () => {
        const result = await SegmentRecipient.create(singleSegmentRecipient)

        const updateData = { joinDate: new Date() };
        const res = await request.put(`${prefix_url}/${result._id}`).send(updateData);
        expect(res.statusCode).toEqual(200);
        expect(new Date(res.body.data.joinDate)).toEqual(updateData.joinDate);
    });

    it('should delete a segment recipient', async () => {
        const result = await SegmentRecipient.create(singleSegmentRecipient)

        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find a segment recipient after deletion', async () => {
        const result = await SegmentRecipient.create(singleSegmentRecipient)

        await request.delete(`${prefix_url}/${result._id}`);
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});

