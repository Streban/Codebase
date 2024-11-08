const { PreferenceController } = require('../../apis/controller/preference.controller');
const Preference = require('../../apis/models/preference.model');


describe('createOne', () => {

    it('successfully creates a preference', async () => {
        const mockPreferenceData = { email: 'test@example.com', restricted: true, shortCode: 'ABCD' };
        const result = await PreferenceController.createOne(mockPreferenceData);
        expect(result.email).toBe(mockPreferenceData.email);
        expect(result.shortCode).toBe(mockPreferenceData.shortCode);
    });

    it('fails to create a new preference without required fields', async () => {
        const fieldData = {
            restricted: true, shortCode: 'ABCD'
            // required field email is missing
        };

        try {
            await PreferenceController.createOne(fieldData);
        } catch (error) {
            expect(error.errors.email.kind).toBe('required');
        }
    });


    jest.mock("../../apis/models/preference.model")
    Preference.findOneAndDelete = jest.fn()

    describe('removeOne', () => {
        beforeEach(() => {
            Preference.findOneAndDelete.mockClear();
        });

        it('successfully deletes a preference by id', async () => {
            const mockId = 'someValidMongoDbId';
            const mockDoc = { _id: mockId, email: 'test@example.com', restricted: true, shortCode: 'ABCD' };

            Preference.findOneAndDelete.mockResolvedValue(mockDoc);

            const result = await PreferenceController.removeOne(mockId);

            expect(Preference.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toEqual(mockDoc);
        });

        it('returns null when trying to delete a non-existing preference', async () => {
            const mockId = 'nonExistingId';
            Preference.findOneAndDelete.mockResolvedValue(null);

            const result = await PreferenceController.removeOne(mockId);

            expect(Preference.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toBeNull();
        });

        it('throws an error if the delete operation fails', async () => {
            const mockError = new Error('Delete operation failed');
            Preference.findOneAndDelete.mockRejectedValue(mockError);

            const mockId = 'someValidMongoDbId';

            await expect(PreferenceController.removeOne(mockId)).rejects.toThrow('Delete operation failed');
        });
    });


    Preference.deleteMany = jest.fn()


    describe('removeAll', () => {
        beforeEach(() => {
            Preference.deleteMany.mockClear();
        });

        it('successfully deletes all preferences', async () => {
            Preference.deleteMany.mockResolvedValue({ deletedCount: 5 });

            const result = await PreferenceController.removeAll();

            expect(Preference.deleteMany).toHaveBeenCalledWith({});
            expect(result.deletedCount).toBe(5);
        });

        it('throws an error if the delete operation fails', async () => {
            const mockError = new Error('Failed to delete');
            Preference.deleteMany.mockRejectedValue(mockError);

            await expect(PreferenceController.removeAll()).rejects.toThrow('Failed to delete');
        });
    });




    Preference.findOne = jest.fn()


    describe('getOne', () => {
        beforeEach(() => {
            Preference.findOne.mockClear();
        });

        it('successfully retrieves a preference document', async () => {
            const mockFilter = { email: 'test@example.com' };
            const mockDoc = { _id: 'mockId', email: 'test@example.com', restricted: true, shortCode: 'ABCD' };

            Preference.findOne.mockResolvedValue(mockDoc);

            const result = await PreferenceController.getOne(mockFilter);

            expect(Preference.findOne).toHaveBeenCalledWith(mockFilter);
            expect(result).toEqual(mockDoc);
        });

        it('returns null if no document is found', async () => {
            const mockFilter = { email: 'notfound@example.com' };

            Preference.findOne.mockResolvedValue(null);

            const result = await PreferenceController.getOne(mockFilter);

            expect(Preference.findOne).toHaveBeenCalledWith(mockFilter);
            expect(result).toBeNull();
        });

        it('throws an error if the find operation fails', async () => {
            const mockFilter = { email: 'error@example.com' };
            const mockError = new Error('Database error');

            Preference.findOne.mockRejectedValue(mockError);

            await expect(PreferenceController.getOne(mockFilter)).rejects.toThrow('Database error');
        });
    });


    Preference.find = jest.fn()

    describe('getAll', () => {
        beforeEach(() => {
            Preference.find.mockClear();
        });

        it('successfully retrieves all preference documents', async () => {
            const mockDocs = [
                { _id: '1', email: 'test1@example.com', restricted: true, shortCode: 'ABCD' },
                { _id: '2', email: 'test2@example.com', restricted: false, shortCode: 'EFGH' },
            ];
            Preference.find.mockResolvedValue(mockDocs);
            const result = await PreferenceController.getAll();
            expect(Preference.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockDocs);
        });

        it('throws an error if the find operation fails', async () => {
            const mockError = new Error('Database error');
            Preference.find.mockRejectedValue(mockError);

            await expect(PreferenceController.getAll()).rejects.toThrow('Database error');
        });
    });


    Preference.findOneAndUpdate = jest.fn()


    describe('updateOne', () => {
        beforeEach(() => {
            Preference.findOneAndUpdate.mockClear();
        });

        it('successfully updates a preference document', async () => {
            const mockEmail = 'test@example.com';
            const mockData = { restricted: true };
            const mockUpdatedDoc = { email: mockEmail, ...mockData };

            Preference.findOneAndUpdate.mockResolvedValue(mockUpdatedDoc);

            const result = await PreferenceController.updateOne(mockEmail, mockData);

            expect(Preference.findOneAndUpdate).toHaveBeenCalledWith(
                { email: mockEmail },
                mockData,
                { upsert: true, new: true }
            );
            expect(result).toEqual(mockUpdatedDoc);
        });

        it('throws an error if the update operation fails', async () => {
            const mockError = new Error('Update failed');
            Preference.findOneAndUpdate.mockRejectedValue(mockError);

            const mockEmail = 'fail@example.com';
            const mockData = { restricted: false };

            await expect(PreferenceController.updateOne(mockEmail, mockData)).rejects.toThrow('Update failed');
        });
    });

});
