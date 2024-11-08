const mongoose = require('mongoose')
const AdminPreference = require('../../apis/models/adminPreference')
const { createAdminPreference, findAdminPreference, getAll, removeAll, removeOne, updateOne } = require('../../apis/controller/tableAdminPreference.controller')

describe('Admin Preference Test Cases', () => {
    describe('createAdminPreference', () => {

        it('successfully creates admin preferences', async () => {
            const mockPreferences = { serviceName: 'emailSvc', businessId: 'someBusinessId', columnId: new mongoose.mongo.ObjectId() }
            const result = await createAdminPreference(mockPreferences);
            expect(result.businessId).toBe(mockPreferences.businessId);
            expect(result.serviceName).toBe(mockPreferences.serviceName);
            expect(result).toHaveProperty('_id');
        });
        it('fails to create a new admin preference without required fields', async () => {
            const fieldData = {
                serviceName: 'emailSvc', businessId: 'someBusinessId',
                // columnId is missing
            };
            try {
                await createAdminPreference(fieldData);
            } catch (error) {
                expect(error.errors.columnId.kind).toBe('required');
            }
        });
    });

    AdminPreference.find = jest.fn()
    describe('findAdminPreference', () => {
        beforeEach(() => {
            AdminPreference.find.mockClear();
        });

        it('successfully finds admin preferences', async () => {
            const mockQuery = { serviceName: 'emailSvc' };
            const mockDocs = [
                { _id: '1', serviceName: 'emailSvc', businessId: 'someBusinessId', column_name: 'first_name', columnId: new mongoose.mongo.ObjectId() },
                // Add more documents as needed
            ];

            AdminPreference.find.mockResolvedValue(mockDocs);

            const result = await findAdminPreference(mockQuery);

            expect(AdminPreference.find).toHaveBeenCalledWith(mockQuery);
            expect(result).toEqual(mockDocs);
        });

        it('throws an error if the find operation fails', async () => {
            const mockQuery = { serviceName: 'nonexistentSvc' };
            const mockError = new Error('Find operation failed');

            AdminPreference.find.mockRejectedValue(mockError);

            await expect(findAdminPreference(mockQuery)).rejects.toThrow('Find operation failed');
        });
    });



    AdminPreference.findOneAndDelete = jest.fn()
    describe('removeOne', () => {
        beforeEach(() => {
            AdminPreference.findOneAndDelete.mockClear();
        });

        it('successfully deletes an admin preference by id', async () => {
            const mockId = 'mockId';
            const mockDoc = { _id: mockId, serviceName: 'emailSvc', businessId: 'someBusinessId' };

            AdminPreference.findOneAndDelete.mockResolvedValue(mockDoc);

            const result = await removeOne(mockId);

            expect(AdminPreference.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toEqual(mockDoc);
        });

        it('returns null when trying to delete a non-existing admin preference', async () => {
            const mockId = 'nonExistingId';

            AdminPreference.findOneAndDelete.mockResolvedValue(null);

            const result = await removeOne(mockId);

            expect(AdminPreference.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toBeNull();
        });

        it('throws an error if the delete operation fails', async () => {
            const mockError = new Error('Delete operation failed');
            AdminPreference.findOneAndDelete.mockRejectedValue(mockError);

            const mockId = 'someValidMongoDbId';

            await expect(removeOne(mockId)).rejects.toThrow('Delete operation failed');
        });
    });



    AdminPreference.findOneAndUpdate = jest.fn()

    describe('updateOne', () => {
        beforeEach(() => {
            AdminPreference.findOneAndUpdate.mockClear();
        });

        it('successfully updates an admin preference by id', async () => {
            const mockId = 'mockId';
            const mockData = { serviceName: 'updatedEmailSvc' };
            const mockDoc = { _id: mockId, ...mockData };

            AdminPreference.findOneAndUpdate.mockResolvedValue(mockDoc);

            const result = await updateOne(mockId, mockData);

            expect(AdminPreference.findOneAndUpdate).toHaveBeenCalledWith(
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
            AdminPreference.findOneAndUpdate.mockRejectedValue(mockError);

            // Expect the function to throw an error during failure
            await expect(updateOne(mockId, mockData)).rejects.toThrow('Update operation failed');
        });
    });



    AdminPreference.deleteMany = jest.fn()

    describe('removeAll', () => {
        beforeEach(() => {
            AdminPreference.deleteMany.mockClear();
        });

        it('successfully removes all admin preferences', async () => {
            const mockDeletionResult = { deletedCount: 5 };
            AdminPreference.deleteMany.mockResolvedValue(mockDeletionResult);

            const result = await removeAll();

            expect(AdminPreference.deleteMany).toHaveBeenCalledWith({});
            expect(result).toEqual(mockDeletionResult);
        });

        it('throws an error if the delete operation fails', async () => {
            const mockError = new Error('Delete operation failed');
            AdminPreference.deleteMany.mockRejectedValue(mockError);

            await expect(removeAll()).rejects.toThrow('Delete operation failed');
        });
    });



    AdminPreference.paginate = jest.fn()
    describe('getAll ', () => {
        beforeEach(() => {
            AdminPreference.paginate.mockClear();
        });

        it('successfully retrieves paginated admin preferences', async () => {
            const mockFilter = {};
            const mockOptions = { page: 1, limit: 10 };
            const mockDocs = {
                docs: [{ _id: '1', serviceName: 'emailSvc', businessId: 'someBusinessId' }],
                totalDocs: 1,
                limit: 10,
                totalPages: 1,
                page: 1,
            };

            AdminPreference.paginate.mockResolvedValue(mockDocs);

            const result = await getAll(mockFilter, mockOptions);

            expect(AdminPreference.paginate).toHaveBeenCalledWith(mockFilter, mockOptions);
            expect(result).toEqual(mockDocs);
        });

        it('throws an error if the retrieval operation fails', async () => {
            const mockFilter = {};
            const mockOptions = { page: 1, limit: 10 };
            const mockError = new Error('Retrieval operation failed');

            AdminPreference.paginate.mockRejectedValue(mockError);

            await expect(getAll(mockFilter, mockOptions)).rejects.toThrow('Retrieval operation failed');
        });
    });



});
