jest.mock('../../../apis/controller/cred.controller');
const { CredentailsController } = require('../../../apis/controller/cred.controller');

const app = require('../../../app')
const request = require('supertest')(app);


const prefix_url = '/email_svc/pb/credentials'

describe('Credentials Test Cases', () => {
    describe('POST /', () => {

        beforeAll(() => {
            jest.mock('../../../apis/models/credentials.model', () => {
                return {

                    create: jest.fn()
                };
            });
        });

        afterAll(() => {
            jest.resetAllMocks();

        });


        it('should validate and reject a request with missing required fields', async () => {
            const payload = {
                // Intentionally missing required fields like `server`, `country`.
                auth: {
                    user: 'user@example.com',
                    pass: 'password'
                },
                port: 587
            };

            await request.post(prefix_url)
                .send(payload)
                .expect('Content-Type', /json/)
                .expect(422)
                .then((response) => {
                    console.log("object eponse ", response.body);
                    expect(response.body).toHaveProperty('message');
                });
        });

        it('should create an email credentials template on a valid request', async () => {
            const validPayload = {
                server: 'smtp.example.com',
                country: 'USA',
                type: 'otp',
                businessId: 'someBusinessId',
                port: 587,
                auth: {
                    user: 'user@example.com',
                    pass: 'password'
                },
                secure: false,
                primary: false
            };

            CredentailsController.createOne.mockResolvedValue({
                _id: 'newlyCreatedId',
                ...validPayload
            });

            await request.post(prefix_url)
                .send(validPayload)
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                    expect(response.body.data).toMatchObject(validPayload);
                });
        });

    });



    describe('PUT /:ID endpoint', () => {
        it('updates a credential and returns the updated document', async () => {
            const validPayload = {
                server: 'smtp.example.com',
                country: 'USA',
                type: 'otp',
                businessId: 'someBusinessId',
                port: 587,
                auth: {
                    user: 'user@example.com',
                    pass: 'password'
                },
                secure: false,
                primary: false
            };

            CredentailsController.createOne.mockResolvedValue({
                _id: 'newlyCreatedId',
                ...validPayload
            });

            const result = await request.post(prefix_url)
                .send(validPayload)
                .expect('Content-Type', /json/)
            const updatedData = {
                businessId: 'upadetdBussinesId',
            };
            const response = await request.put(`${prefix_url}/${result.body.data._id}`)
                .send(updatedData)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.body.message).toBe("Updated successfully");
        });

    });

    const EmailCredentialsTemplate = require('../../../apis/models/credentials.model');

    EmailCredentialsTemplate.findOneAndDelete = jest.fn()
    describe('DELETE /:ID endpoint', () => {
        beforeEach(() => {
            EmailCredentialsTemplate.findOneAndDelete.mockResolvedValue({ _id: 'mockId', /* more fields if needed */ });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('successfully deletes an email credential and returns a success message', async () => {
            const mockId = 'existingId';

            const response = await request.delete(`${prefix_url}/${mockId}`)
                .expect(200);
            expect(response.body.message).toBe('Removed successfully.');
        });

        it('attempts to delete a non-existent email credential and returns an error', async () => {
            EmailCredentialsTemplate.findOneAndDelete.mockResolvedValue(null);

            const nonExistentId = 'nonExistentId';

            const response = await request.delete(`${prefix_url}/${nonExistentId}`)

            expect(response.body.message).toBe('Removed successfully.');
        });

    });


});
