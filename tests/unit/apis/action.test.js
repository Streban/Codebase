const app = require('../../../app')
const request = require('supertest')(app);
const Action = require('../../../apis/models/action.model');



const prefix_url = '/email_svc/pb/action'


const ationObjects = [
    { type: 'click' },
    { type: 'view' },
    { type: 'purchase' },
]


const singleActionObject = { type: 'click' }

describe('Action API TEST CASES', () => {
    it('should create a new action', async () => {
        const res = await request.post(prefix_url)
            .send(singleActionObject);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.type).toEqual(singleActionObject.type)

    });


    describe('GET / Paginated Result', () => {
        beforeAll(async () => {
            await Action.insertMany(ationObjects);
        });
        afterAll(async () => {
            await Action.deleteMany({});
        });


        it('should retrieve all action', async () => {
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
                .query({ sort: 'type', limit: 5 })
                .expect(200);

            const actions = response.body.data.docs.map(action => action.type);
            const sortedActions = [...actions].sort();

            expect(actions).toEqual(sortedActions);
        });


        it('filters the result set by action type', async () => {
            const type = 'view';
            const response = await request.get(prefix_url)
                .query({ type: type })
                .expect(200);

            response.body.data.docs.forEach(doc => {
                expect(doc.type).toEqual(type);
            });
        });


    });


    it('should retrieve a action by ID', async () => {
        const result = await Action.create(singleActionObject)

        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toEqual(result._id.toString());
    });

    it('should update a action', async () => {
        const result = await Action.create(singleActionObject)

        const res = await request.put(`${prefix_url}/${result._id}`)
            .send({
                type: 'purchase',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.type).toEqual('purchase');
    });

    it('should delete a action', async () => {

        const result = await Action.create(singleActionObject)

        const res = await request.delete(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should not find the action after deletion', async () => {

        const result = await Action.create(singleActionObject)
        await Action.findByIdAndDelete(result._id)
        const res = await request.get(`${prefix_url}/${result._id}`);
        expect(res.statusCode).toEqual(404);
    });
});
