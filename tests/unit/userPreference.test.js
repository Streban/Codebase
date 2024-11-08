const mongoose = require('mongoose')
const { createUserPreference, findUserPreference, getAll, removeAll, removeOne, updateOne } = require('../../apis/controller/tableUserPreference')
const UserPreference = require('../../apis/models/userPreference')


describe('User Preference Test Cases', () => {
    describe('createUserPreference', () => {

        it('successfully creates User preferences', async () => {
            const mockPreferences = { serviceName: 'emailSvc', businessId: 'someBusinessId', columnId: new mongoose.mongo.ObjectId() }
            const result = await createUserPreference(mockPreferences);
            expect(result.businessId).toBe(mockPreferences.businessId);
            expect(result.serviceName).toBe(mockPreferences.serviceName);
            expect(result).toHaveProperty('_id');
        });
        it('fails to create a new User preference without required fields', async () => {
            const fieldData = {
                serviceName: 'emailSvc', businessId: 'someBusinessId',
                // columnId is missing
            };
            try {
                await createUserPreference(fieldData);
            } catch (error) {
                expect(error.errors.columnId.kind).toBe('required');
            }
        });
    });


    jest.mock('../../apis/models/userPreference')


    UserPreference.find = jest.fn()
    describe('findUserPreference', () => {
        beforeEach(() => {
            UserPreference.find.mockClear();
        });

        it('successfully finds User preferences', async () => {
            const mockQuery = { serviceName: 'emailSvc' };
            const mockDocs = [
                { _id: '1', serviceName: 'emailSvc', businessId: 'someBusinessId', column_name: 'first_name', columnId: new mongoose.mongo.ObjectId() },
                // Add more documents as needed
            ];

            UserPreference.find.mockResolvedValue(mockDocs);

            const result = await findUserPreference(mockQuery);

            expect(UserPreference.find).toHaveBeenCalledWith(mockQuery);
            expect(result).toEqual(mockDocs);
        });

    });



    UserPreference.findOneAndDelete = jest.fn()
    describe('removeOne', () => {
        beforeEach(() => {
            UserPreference.findOneAndDelete.mockClear();
        });

        it('successfully deletes an User preference by id', async () => {
            const mockId = 'mockId';
            const mockDoc = { _id: mockId, serviceName: 'emailSvc', businessId: 'someBusinessId' };

            UserPreference.findOneAndDelete.mockResolvedValue(mockDoc);

            const result = await removeOne(mockId);

            expect(UserPreference.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toEqual(mockDoc);
        });

        it('returns null when trying to delete a non-existing User preference', async () => {
            const mockId = 'nonExistingId';

            UserPreference.findOneAndDelete.mockResolvedValue(null);

            const result = await removeOne(mockId);

            expect(UserPreference.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toBeNull();
        });

        it('throws an error if the delete operation fails', async () => {
            const mockError = new Error('Delete operation failed');
            UserPreference.findOneAndDelete.mockRejectedValue(mockError);

            const mockId = 'someValidMongoDbId';

            await expect(removeOne(mockId)).rejects.toThrow('Delete operation failed');
        });
    });



    UserPreference.findOneAndUpdate = jest.fn()

    describe('updateOne', () => {
        beforeEach(() => {
            UserPreference.findOneAndUpdate.mockClear();
        });

        it('successfully updates an User preference by id', async () => {
            const mockId = 'mockId';
            const mockData = { serviceName: 'updatedEmailSvc' };
            const mockDoc = { _id: mockId, ...mockData };

            UserPreference.findOneAndUpdate.mockResolvedValue(mockDoc);

            const result = await updateOne(mockId, mockData);

            expect(UserPreference.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockId },
                mockData,
                { new: true }
            );
            expect(result).toEqual(mockDoc);
        });

        it('throws an error if the update operation fails', async () => {
            const mockId = 'someValidMongoDbId';
            const mockData = { serviceName: 'failEmailSvc' };
            const mockError = new Error('Update operation failed');

            // Mock findOneAndUpdate to simulate an update failure
            UserPreference.findOneAndUpdate.mockRejectedValue(mockError);

            // Expect the function to throw an error during failure
            await expect(updateOne(mockId, mockData)).rejects.toThrow('Update operation failed');
        });
    });



    UserPreference.deleteMany = jest.fn()

    describe('removeAll', () => {
        beforeEach(() => {
            UserPreference.deleteMany.mockClear();
        });

        it('successfully removes all User preferences', async () => {
            const mockDeletionResult = { deletedCount: 5 };
            UserPreference.deleteMany.mockResolvedValue(mockDeletionResult);

            const result = await removeAll();

            expect(UserPreference.deleteMany).toHaveBeenCalledWith({});
            expect(result).toEqual(mockDeletionResult);
        });

        it('throws an error if the delete operation fails', async () => {
            const mockError = new Error('Delete operation failed');
            UserPreference.deleteMany.mockRejectedValue(mockError);

            await expect(removeAll()).rejects.toThrow('Delete operation failed');
        });
    });



    UserPreference.paginate = jest.fn()
    describe('getAll', () => {
        beforeEach(() => {
            UserPreference.paginate.mockClear();
        });

        it('successfully retrieves paginated User preferences', async () => {
            const mockFilter = {};
            const mockOptions = { page: 1, limit: 10 };
            const mockDocs = {
                docs: [{ _id: '1', serviceName: 'emailSvc', businessId: 'someBusinessId' }],
                totalDocs: 1,
                limit: 10,
                totalPages: 1,
                page: 1,
            };

            UserPreference.paginate.mockResolvedValue(mockDocs);

            const result = await getAll(mockFilter, mockOptions);

            expect(UserPreference.paginate).toHaveBeenCalledWith(mockFilter, mockOptions);
            expect(result).toEqual(mockDocs);
        });

        it('throws an error if the retrieval operation fails', async () => {
            const mockFilter = {};
            const mockOptions = { page: 1, limit: 10 };
            const mockError = new Error('Retrieval operation failed');

            UserPreference.paginate.mockRejectedValue(mockError);

            await expect(getAll(mockFilter, mockOptions)).rejects.toThrow('Retrieval operation failed');
        });
    });






});