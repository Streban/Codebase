const { checkEmailSetting, createOne, getAll, removeOne, updateOne, updateByUserId, getUserById } = require('../../apis/controller/userEmailSetting.controller');
const UserEmailSetting = require('../../apis/models/userEmailSettings');


describe('User Email Settings Test Cases', () => {

    describe('createOne', () => {
        it('successfully creates a user email setting', async () => {
            const mockInput = {
                user: 'userId',
                email: 'user@example.com',
                setting: { notifications: true },
                businessId: 'businessId',
            };

            const result = await createOne(mockInput);

            expect(result.email).toBe(mockInput.email)
            expect(result.user).toBe(mockInput.user)
            expect(result.businessId).toBe(mockInput.businessId)
            expect(result).toHaveProperty('_id');

        });

        it('fails to create a new user email settings without required fields', async () => {
            const fieldData = {
                user: 'userId1',
                email: 'user@example.com',
                // businessId is missing
            };
            try {
                await createOne(fieldData);
            } catch (error) {
                expect(error.errors.businessId.kind).toBe('required');
            }
        });


    });




    describe('checkEmailSetting', () => {


        it('returns true if the specified field is truthy in user data', async () => {

            const mockInput = {
                user: 'newUserId',
                email: 'user@example.com',
                setting: { notifications: true },
                businessId: 'businessId',
            };

            const result = await createOne(mockInput);

            const user = await getUserById(result.user)

            const settings = await checkEmailSetting({ user: user.user, field: 'notifications' })

            expect(settings).toBe(true);


        });

        it('returns false if the specified field is falsy or undefined in user data', async () => {
            const mockInput = {
                user: 'newUserId',
                email: 'user@example.com',
                setting: { notifications: true },
                businessId: 'businessId',
            };

            const result = await createOne(mockInput);

            const user = await getUserById(result.user)

            const settings = await checkEmailSetting({ user: user.user, field: 'marketing' })

            expect(settings).toBe(false);
        });


    });



    UserEmailSetting.findOneAndUpdate = jest.fn()
    describe('updateOne', () => {
        beforeEach(() => {
            UserEmailSetting.findOneAndUpdate.mockReset();
        });

        it('successfully updates a document and returns the new document', async () => {
            const mockId = 'someId';
            const mockData = { email: 'new@example.com' };
            const mockUpdatedDoc = { _id: mockId, ...mockData };

            UserEmailSetting.findOneAndUpdate.mockImplementation((query, update, options, callback) => {
                callback(null, mockUpdatedDoc); // Simulate successful update
            });

            const result = await updateOne(mockId, mockData);

            expect(UserEmailSetting.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: mockId },
                mockData,
                { upsert: false, new: true },
                expect.any(Function) // Since the callback function is internally created
            );
            expect(result).toEqual(mockUpdatedDoc);
        });

        it('throws an error if the update operation fails', async () => {
            const mockId = 'someId';
            const mockData = { email: 'fail@example.com' };
            const mockError = new Error('Update failed');

            UserEmailSetting.findOneAndUpdate.mockImplementation((query, update, options, callback) => {
                callback(mockError, null); // Simulate update failure
            });

            await expect(updateOne(mockId, mockData)).rejects.toThrow('Update failed');
        });
    });




    UserEmailSetting.find = jest.fn()


    describe('getAll', () => {
        beforeEach(() => {
            UserEmailSetting.find.mockClear();
        });

        it('successfully retrieves all documents', async () => {
            const mockDocs = [
                { _id: '1', user: 'user1', email: 'user1@example.com', setting: {} },
                { _id: '2', user: 'user2', email: 'user2@example.com', setting: {} },
            ];

            UserEmailSetting.find.mockResolvedValue(mockDocs);

            const result = await getAll();

            expect(UserEmailSetting.find).toHaveBeenCalledWith({});
            expect(result).toEqual(mockDocs);
        });

        it('throws an error if the retrieval operation fails', async () => {
            const mockError = new Error('Retrieval operation failed');

            UserEmailSetting.find.mockRejectedValue(mockError);

            await expect(getAll()).rejects.toThrow('Retrieval operation failed');
        });
    });


    UserEmailSetting.findOneAndDelete = jest.fn()




    describe('removeOne', () => {
        beforeEach(() => {
            UserEmailSetting.findOneAndDelete.mockClear();
        });

        it('successfully deletes a document by id', async () => {
            const mockId = 'someId';
            const mockDoc = { _id: mockId, email: 'user@example.com', setting: {} };

            UserEmailSetting.findOneAndDelete.mockResolvedValue(mockDoc);

            const result = await removeOne(mockId);

            expect(UserEmailSetting.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toEqual(mockDoc);
        });

        it('returns null when trying to delete a non-existing document', async () => {
            const mockId = 'nonExistingId';

            // Simulate no document being found/deleted
            UserEmailSetting.findOneAndDelete.mockResolvedValue(null);

            const result = await removeOne(mockId);

            expect(UserEmailSetting.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toBeNull();
        });

        it('throws an error if the delete operation fails', async () => {
            const mockId = 'someId';
            const mockError = new Error('Delete operation failed');

            UserEmailSetting.findOneAndDelete.mockRejectedValue(mockError);

            await expect(removeOne(mockId)).rejects.toThrow('Delete operation failed');
        });
    });



});
