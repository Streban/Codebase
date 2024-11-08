const BusinessController = require('../../apis/controller/business.controller');
const Business = require('../../apis/models/business.model');
const mongoose = require('mongoose')


describe('Business Test cases', () => {
    describe('Create function', () => {

        it('should create multiple Business successfully', async () => {
            const businesses = [
                {
                    name: "Business One",
                    businessId: "biz123",
                    accessKey: "accessKey1",
                },
                {
                    name: "Business Two",
                    businessId: "biz456",
                    accessKey: "accessKey2",
                }
            ];

            const createdBusinesses = await BusinessController.createMany(businesses);
            expect(createdBusinesses.length).toEqual(businesses.length);

            for (let i = 0; i < createdBusinesses.length; i++) {
                const { _id, __v, ...dataWithoutMetadata } = createdBusinesses[i].toObject();
                expect(dataWithoutMetadata).toEqual(expect.objectContaining(businesses[i]));
            }

        })
    })


    describe('Update function', () => {
        it('should update a business successfully', async () => {
            const business = await Business.create({
                name: "Original Business",
                businessId: "originalBiz123",
                accessKey: "originalAccessKey",
            });

            const updateData = {
                name: "Updated Business",
                accessKey: "updatedAccessKey",
            };

            const updatedBusiness = await BusinessController.updateOne(business._id, updateData);

            expect(updatedBusiness).not.toBeNull();
            expect(updatedBusiness.name).toEqual(updateData.name);
            expect(updatedBusiness.accessKey).toEqual(updateData.accessKey);

            const fetchedUpdatedBusiness = await Business.findById(business._id);
            expect(fetchedUpdatedBusiness).not.toBeNull();
            expect(fetchedUpdatedBusiness.name).toEqual(updateData.name);
            expect(fetchedUpdatedBusiness.accessKey).toEqual(updateData.accessKey);
        });
    });


    describe('Remove All function', () => {
        it('should remove all businesses successfully', async () => {
            await Business.create([
                { name: "Business One", businessId: "biz123", accessKey: "accessKey1" },
                { name: "Business Two", businessId: "biz456", accessKey: "accessKey2" }
            ]);

            const countBefore = await Business.countDocuments();
            expect(countBefore).toBeGreaterThan(0);

            await BusinessController.removeAll();

            const countAfter = await Business.countDocuments();
            expect(countAfter).toEqual(0);
        });
    });



    describe('Create One function', () => {
        it('should create a business successfully', async () => {
            const sampleBusiness = {
                name: "New Business",
                businessId: "newBiz123",
                accessKey: "newAccessKey",
            };

            const createdBusiness = await BusinessController.createOne(sampleBusiness);

            expect(createdBusiness).not.toBeNull();
            expect(createdBusiness.name).toEqual(sampleBusiness.name);
            expect(createdBusiness.businessId).toEqual(sampleBusiness.businessId);
            expect(createdBusiness.accessKey).toEqual(sampleBusiness.accessKey);

            const dbBusiness = await Business.findById(createdBusiness._id);
            expect(dbBusiness).not.toBeNull();
            expect(dbBusiness.name).toEqual(sampleBusiness.name);
            expect(dbBusiness.businessId).toEqual(sampleBusiness.businessId);
            expect(dbBusiness.accessKey).toEqual(sampleBusiness.accessKey);
        });
    });
    describe('Remove One function', () => {
        it('should remove a business successfully', async () => {
            const sampleBusiness = await Business.create({
                name: "Business to Remove",
                businessId: "removeBiz123",
                accessKey: "removeAccessKey",
            });

            const removedBusiness = await BusinessController.removeOne(sampleBusiness._id);

            expect(removedBusiness).not.toBeNull();
            expect(removedBusiness._id.toString()).toEqual(sampleBusiness._id.toString());

            const dbBusiness = await Business.findById(sampleBusiness._id);
            expect(dbBusiness).toBeNull();
        });

        it('should return null if no business matches the provided _id', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const result = await BusinessController.removeOne(nonExistentId);
            expect(result).toBeNull();
        });
    });


})