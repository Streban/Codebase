const { fieldcontroller } = require('../../apis/controller/field.controller');
const Field = require('../../apis/models/field.model');


describe('Field Test Cases', () => {
    describe('createOne function', () => {
        it('creates a new field successfully', async () => {
            const fieldData = {
                name: 'Example Field',
                businessId: 'someBusinessId',
            };

            const savedField = await fieldcontroller.createOne(fieldData);
            expect(savedField).toHaveProperty('_id');
            expect(savedField.name).toBe(fieldData.name);
            expect(savedField.businessId).toBe(fieldData.businessId);
        });

        it('fails to create a new field without required fields', async () => {
            const fieldData = {
                name: 'Example Field Without Business ID',
                // businessId is missing
            };

            try {
                await fieldcontroller.createOne(fieldData);
            } catch (error) {
                expect(error.errors.businessId.kind).toBe('required');
            }
        });
    });



    jest.mock('../../apis/models/field.model');

    describe('removeOne function', () => {
        beforeEach(() => {
            Field.findOneAndDelete.mockClear();
        });

        Field.findOneAndDelete = jest.fn();


        it('successfully deletes a field by id', async () => {
            const mockId = 'someValidMongoDbId';
            const mockDoc = { _id: mockId, name: 'Test Field', businessId: 'someBusinessId' };

            Field.findOneAndDelete.mockResolvedValue(mockDoc);

            const result = await fieldcontroller.removeOne(mockId);

            expect(Field.findOneAndDelete).toHaveBeenCalledWith({ _id: mockId });
            expect(result).toEqual(mockDoc);
        });

        it('throws an error if the delete operation fails', async () => {
            const mockId = 'someValidMongoDbId';
            const mockError = new Error('Delete operation failed');

            Field.findOneAndDelete.mockRejectedValue(mockError);

            await expect(fieldcontroller.removeOne(mockId)).rejects.toThrow('Delete operation failed');
        });
    });





    Field.deleteMany = jest.fn();
    describe('removeAll function', () => {
        beforeEach(() => {
            Field.deleteMany.mockClear();
        });

        it('successfully deletes all fields', async () => {
            const mockResponse = { deletedCount: 5 }; // Assuming there were 5 documents to delete
            Field.deleteMany.mockResolvedValue(mockResponse);

            const result = await fieldcontroller.removeAll();

            expect(Field.deleteMany).toHaveBeenCalledWith({});
            expect(result).toEqual(mockResponse);
        });

        it('throws an error if the delete operation fails', async () => {
            const mockError = new Error('Delete operation failed');
            Field.deleteMany.mockRejectedValue(mockError);

            await expect(fieldcontroller.removeAll()).rejects.toThrow('Delete operation failed');
        });
    });


    Field.find = jest.fn();

    describe('getAll function', () => {
        beforeEach(() => {
            Field.find.mockClear();
        });

        it('successfully retrieves documents based on filter', async () => {
            const mockDocs = [{ _id: '1', name: 'Test Field 1' }, { _id: '2', name: 'Test Field 2' }];
            Field.find.mockResolvedValue(mockDocs);

            const filter = { name: 'Test Field 1' };
            const result = await fieldcontroller.getAll(filter);

            expect(Field.find).toHaveBeenCalledWith(filter);
            expect(result).toEqual(mockDocs);
        });

        it('throws an error when the database operation fails', async () => {
            const mockError = new Error('Database error');
            Field.find.mockRejectedValue(mockError);

            const filter = { name: 'Nonexistent Field' };
            await expect(fieldcontroller.getAll(filter)).rejects.toThrow('Database error');

            expect(Field.find).toHaveBeenCalledWith(filter);
        });
    });




    Field.findOneAndUpdate = jest.fn()


    describe('updateOne function', () => {
        beforeEach(() => {
            Field.findOneAndUpdate.mockClear();
        });

        it('successfully updates a document by id', async () => {
            const id = 'someId';
            const data = { name: 'Updated Name' };
            const mockUpdatedDoc = { _id: id, ...data };
            Field.findOneAndUpdate.mockResolvedValue(mockUpdatedDoc);

            const result = await fieldcontroller.updateOne(id, data);

            expect(Field.findOneAndUpdate).toHaveBeenCalledWith({ _id: id }, data, { upsert: false, new: true });
            expect(result).toEqual(mockUpdatedDoc);
        });

        it('throws an error when the update operation fails', async () => {
            const mockError = new Error('Update failed');
            Field.findOneAndUpdate.mockRejectedValue(mockError);

            const id = 'someId';
            const data = { name: 'Failed Update' };
            await expect(fieldcontroller.updateOne(id, data)).rejects.toThrow('Update failed');

            expect(Field.findOneAndUpdate).toHaveBeenCalledWith({ _id: id }, data, { upsert: false, new: true });
        });
    });





});
