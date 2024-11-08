const app = require('../../../app')
const request = require('supertest')(app);
const Segment = require('../../../apis/models/segment.model');



const prefix_url = '/email_svc/pb/segment'

const segmentsObjects = [
    'A', 'B', 'C', 'D', 'E'
].map((i) => ({
    name: 'Segment ' + i,
    criteriaDescription: 'Criteria for Segment ' + i
}));




const singleSegmentObject = {
    name: 'Segment D',
    criteriaDescription: 'Criteria for Segment D'
}

describe('Segment API TEST CASES', () => {
    it('should create a new Segment', async () => {
        const res = await request.post(prefix_url)
            .send(singleSegmentObject);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.name).toEqual(singleSegmentObject.name)

    });


    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await Segment.insertMany(segmentsObjects);
        });
        afterAll(async () => {
            await Segment.deleteMany({});
        });


        it('should retrieve all Segment', async () => {
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


        it('filters the result set by Segment name', async () => {
            const segment = 'Segment C';
            const response = await request.get(prefix_url)
                .query({ name: segment })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.name).toEqual(segment);
            });
        });


    });


    it('should retrieve a Segment by ID', async () => {
        const result = await Segment.create(singleSegmentObject)

        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toEqual(result._id.toString());
    });

    it('should update a Segment', async () => {
        const result = await Segment.create(singleSegmentObject)
        const res = await request.put(`${prefix_url}/${result._id}`)
            .send({
                name: 'Updated segment',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.name).toEqual('Updated segment');
    });

    it('should delete a Segment', async () => {

        const result = await Segment.create(singleSegmentObject)
        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find the Segment after deletion', async () => {

        const result = await Segment.create(singleSegmentObject)
        await Segment.findByIdAndDelete(result._id)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});
