
const { CredentailsController } = require('../../apis/controller/cred.controller');
const EmailCredentialsTemplate = require('../../apis/models/credentials.model');
const mongoose = require('mongoose')




describe('Credentials Test cases', () => {
    describe('Create Many function', () => {

        it('should create multiple email credentials successfully', async () => {
            const credentials = [
                {
                    auth: { user: "user1@example.com", pass: "pass1" },
                    server: "smtp.example.com",
                    port: 587,
                    secure: false,
                    primary: true,
                    type: "otp",
                    businessId: "biz123",
                    country: "Country1"
                },
                {
                    auth: { user: "user2@example.com", pass: "pass2" },
                    server: "smtp.example.com",
                    port: 587,
                    secure: true,
                    primary: false,
                    type: "marketing",
                    businessId: "biz456",
                    country: "Country2"
                }
            ];

            const createdCredentials = await CredentailsController.createMany(credentials);
            expect(createdCredentials.length).toEqual(credentials.length);

            for (let i = 0; i < createdCredentials.length; i++) {
                const { _id, __v, ...dataWithoutMetadata } = createdCredentials[i].toObject();
                expect(dataWithoutMetadata).toEqual(expect.objectContaining(credentials[i]));
            }
        });
    });



    describe('CreateOne function', () => {

        it('should create a single email credential successfully', async () => {
            const credential = {
                auth: { user: "user@example.com", pass: "password" },
                server: "smtp.example.com",
                port: 587,
                secure: false,
                primary: true,
                type: "otp",
                businessId: "businessId123",
                country: "CountryX"
            };

            const createdCredential = await CredentailsController.createOne(credential);
            const { _id, __v, ...dataWithoutMetadata } = createdCredential.toObject();
            expect(dataWithoutMetadata).toEqual(expect.objectContaining(credential));
        });

        it('should handle errors when creating a new credential fails', async () => {
            const invalidCredential = {
                // Missing required fields
            };

            await expect(CredentailsController.createOne(invalidCredential)).rejects.toThrow();
        });
    });



    describe('Email Credentials Update Test Cases', () => {
        let existingCredentialId;

        beforeAll(async () => {
            const testCredential = new EmailCredentialsTemplate({
                auth: { user: "initial@example.com", pass: "initialPass" },
                server: "smtp.initial.com",
                port: 587,
                secure: false,
                primary: true,
                type: "otp",
                businessId: "initialBusinessId",
                country: "InitialCountry"
            });

            const createdCredential = await testCredential.save();
            existingCredentialId = createdCredential._id;
        });


        it('should update an email credential successfully', async () => {
            const updateData = {
                server: "smtp.updated.com",
                port: 465,
                secure: true,
                type: "marketing",
                country: "UpdatedCountry"
            };

            const updatedCredential = await CredentailsController.updateOne(existingCredentialId, updateData);
            expect(updatedCredential).not.toBeNull();
            expect(updatedCredential.server).toEqual(updateData.server);
            expect(updatedCredential.port).toEqual(updateData.port);
            expect(updatedCredential.secure).toEqual(updateData.secure);
            expect(updatedCredential.type).toEqual(updateData.type);
            expect(updatedCredential.country).toEqual(updateData.country);
        });

        it('should return null if no document matches the ID to update', async () => {
            // Use a fake ID that does not exist in the database
            const fakeId = new mongoose.Types.ObjectId();
            const updateData = { server: "smtp.fake.com" };

            const result = await CredentailsController.updateOne(fakeId, updateData);
            expect(result).toBeNull();
        });

        it('should handle errors when update operation fails', async () => {
            // Example: using an invalid ID format
            const invalidId = "invalidID";
            const updateData = { server: "smtp.error.com" };

            await expect(CredentailsController.updateOne(invalidId, updateData)).rejects.toThrow();
        });

    })






    jest.mock("../../apis/models/credentials.model");

    describe('Email Credentials Pagination Test Cases', () => {


        it('should paginate email credentials and mask passwords', async () => {
            EmailCredentialsTemplate.paginate = jest.fn();
            EmailCredentialsTemplate.paginate.mockResolvedValue({
                docs: [
                    { auth: { pass: "password123" }, otherField: "value1" },
                    { auth: { pass: "password456" }, otherField: "value2" },
                ],
                totalDocs: 2,
                limit: 10,
                totalPages: 1,
                page: 1,
                pagingCounter: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null,
            });

            const filter = {};
            const options = { page: 1, limit: 10 };
            const result = await CredentailsController.getAll(filter, options);

            expect(EmailCredentialsTemplate.paginate).toHaveBeenCalledWith(filter, options);

            result.docs.forEach(doc => {
                expect(doc.auth.pass).toMatch(/^\*\*\*\*\*\*\*\*.+$/);
            });

            expect(result).toHaveProperty('totalDocs', 2);
            expect(result).toHaveProperty('limit', 10);
            expect(result).toHaveProperty('page', 1);
        });

        it('should handle errors from pagination', async () => {
            const testError = new Error("Test error");
            EmailCredentialsTemplate.paginate.mockRejectedValue(testError);

            const filter = {};
            const options = { page: 1, limit: 10 };

            await expect(CredentailsController.getAll(filter, options)).rejects.toThrow("Test error");
        });
    });


    EmailCredentialsTemplate.findOne = jest.fn();

    describe('getOne function tests', () => {
        beforeEach(() => {
            EmailCredentialsTemplate.findOne.mockClear();
        });

        it('should retrieve a document successfully', async () => {
            const mockDoc = {
                country: 'TestCountry',
                type: 'TestType',
                otherField: 'value',
            };

            EmailCredentialsTemplate.findOne.mockImplementationOnce((query, callback) => callback(null, mockDoc));

            const result = await CredentailsController.getOne('TestCountry', 'TestType');

            expect(result).toEqual(mockDoc);
            expect(EmailCredentialsTemplate.findOne).toHaveBeenCalledWith({ country: 'TestCountry', type: 'TestType' }, expect.any(Function));
        });

        it('should handle errors when the database operation fails', async () => {
            // Mock implementation of findOne to simulate a failed database call
            const testError = new Error('Test error');
            EmailCredentialsTemplate.findOne.mockImplementationOnce((query, callback) => callback(testError, null));

            await expect(CredentailsController.getOne('TestCountry', 'TestType')).rejects.toThrow('Test error');
            expect(EmailCredentialsTemplate.findOne).toHaveBeenCalledWith({ country: 'TestCountry', type: 'TestType' }, expect.any(Function));
        });
    });




    describe('RemoveOne function for EmailCredentials', () => {

        it('should remove an email credential successfully', async () => {
            const sampleEmailCredential = await EmailCredentialsTemplate.create({
                auth: { user: 'test@example.com', pass: 'password123' },
                server: 'smtp.example.com',
                port: 587,
                secure: false,
                primary: true,
                type: 'otp',
                businessId: 'someBusinessId',
                country: 'USA',
            });

            const result = await CredentailsController.removeOne(sampleEmailCredential._id);



            const dbCredential = await EmailCredentialsTemplate.findById(sampleEmailCredential._id);

            expect(dbCredential === null || dbCredential === undefined).toBeTruthy();

        });

        it('should return null if no email credential matches the provided _id', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const result = await CredentailsController.removeOne(nonExistentId);
            expect(result).toBeNull();
        });
    })





})