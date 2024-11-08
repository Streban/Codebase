const campaignTypeService = require('../../apis/controller/campaignType.controller');
const CampaignType = require('../../apis/models/campaignType.model');

// Mocking the mongoose model methods
jest.mock('../../apis/models/campaignType.model', () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

describe('CampaignTypeService', () => {
    describe('createCampaignType', () => {
        it('should create a new campaign type', async () => {
            const mockCampaignType = { name: 'Email', description: 'Email Campaign' };
            CampaignType.create.mockResolvedValue(mockCampaignType);

            const result = await campaignTypeService.createCampaignType(mockCampaignType);

            expect(CampaignType.create).toHaveBeenCalledWith(mockCampaignType);
            expect(result).toEqual(mockCampaignType);
        });
    });

    describe('getAllCampaignTypes', () => {
        it('should return all campaign types with pagination', async () => {
            const mockCampaignTypes = {
                docs: [{ name: 'Email' }, { name: 'Social Media' }],
                totalDocs: 2,
                limit: 10,
                page: 1,
                totalPages: 1,
                pagingCounter: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevPage: null,
                nextPage: null
            };
            // Mock the paginate method instead of find
            CampaignType.paginate = jest.fn().mockResolvedValue(mockCampaignTypes);

            const filter = {};
            const options = { page: 1, limit: 10, sort: { name: 1 } };

            const result = await campaignTypeService.getAllCampaignTypes(filter, options);

            expect(CampaignType.paginate).toHaveBeenCalledWith(filter, options);
            expect(result).toEqual(mockCampaignTypes);
        });
    });
    ;

    describe('getCampaignTypeById', () => {
        it('should return a campaign type by ID', async () => {
            const mockCampaignType = { _id: '1', name: 'Email' };
            CampaignType.findById.mockResolvedValue(mockCampaignType);

            const result = await campaignTypeService.getCampaignTypeById('1');

            expect(CampaignType.findById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockCampaignType);
        });
    });

    describe('updateCampaignType', () => {
        it('should update and return the campaign type', async () => {
            const mockCampaignType = { _id: '1', name: 'Email', description: 'Updated Description' };
            CampaignType.findByIdAndUpdate.mockResolvedValue(mockCampaignType);

            const result = await campaignTypeService.updateCampaignType('1', { description: 'Updated Description' });

            expect(CampaignType.findByIdAndUpdate).toHaveBeenCalledWith('1', { description: 'Updated Description' }, {
                new: true,
                runValidators: true
            });
            expect(result).toEqual(mockCampaignType);
        });
    });

    describe('deleteCampaignType', () => {
        it('should delete the campaign type', async () => {
            CampaignType.findByIdAndDelete.mockResolvedValue(true);

            await campaignTypeService.deleteCampaignType('1');

            expect(CampaignType.findByIdAndDelete).toHaveBeenCalledWith('1');
        });
    });
});
