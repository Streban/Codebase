const mongoose = require('mongoose');
const campaignService = require('../../apis/controller/campaign.controller');
const Campaign = require('../../apis/models/campaign.model');

jest.mock('../../apis/models/campaign.model', () => ({
    create: jest.fn(),
    paginate: jest.fn(),

    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({ business: '123', typeId: '456' }),
    }),
}));



describe('CampaignService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockCampaignData = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Summer Sale',
        business: new mongoose.Types.ObjectId(),
        startDate: new Date(),
        endDate: new Date(),
        description: 'A summer sale for all summer products.',
        typeId: new mongoose.Types.ObjectId(),
        status: 'active'
    };

    it('should create a new campaign', async () => {
        Campaign.create.mockResolvedValue(mockCampaignData);
        const campaign = await campaignService.createCampaign(mockCampaignData);
        expect(Campaign.create).toHaveBeenCalledWith(mockCampaignData);
        expect(campaign).toEqual(mockCampaignData);
    });

    it('should return a paginated list of campaigns', async () => {
        const mockPaginatedResponse = {
            docs: [mockCampaignData],
            totalDocs: 1,
            limit: 10,
            totalPages: 1,
            page: 1,
            pagingCounter: 1,
            hasPrevPage: false,
            hasNextPage: false
        };
        Campaign.paginate.mockResolvedValue(mockPaginatedResponse);
        const filter = {};
        const options = { page: 1, limit: 10, sort: { startDate: -1 } };
        const campaigns = await campaignService.getAllCampaigns(filter, options);
        expect(Campaign.paginate).toHaveBeenCalledWith(filter, options);
        expect(campaigns).toEqual(mockPaginatedResponse);
    });


    it('should return a campaign for a given id', async () => {
        const campaignId = '123';
        const expectedCampaign = { business: '123', typeId: '456' };

        const campaign = await campaignService.getCampaignById(campaignId);

        expect(Campaign.findById).toHaveBeenCalledWith(campaignId);
        expect(Campaign.findById().populate).toHaveBeenCalledWith('business', 'typeId');
        expect(campaign).toEqual(expectedCampaign);
    });
    it('should update a campaign by ID', async () => {
        const update = { name: 'Updated Campaign Name' };
        Campaign.findByIdAndUpdate.mockResolvedValue({ ...mockCampaignData, ...update });
        const updatedCampaign = await campaignService.updateCampaign(mockCampaignData._id, update);
        expect(Campaign.findByIdAndUpdate).toHaveBeenCalledWith(mockCampaignData._id, update, { new: true, runValidators: true });
        expect(updatedCampaign.name).toEqual(update.name);
    });


    it('should delete the campaign', async () => {
        const campaignId = mockCampaignData._id
        Campaign.findByIdAndDelete.mockResolvedValue(mockCampaignData[0]);

        const deletedCampaign = await campaignService.deleteCampaign(campaignId);

        expect(Campaign.findByIdAndDelete).toHaveBeenCalledWith(campaignId);
        expect(deletedCampaign).toEqual(mockCampaignData[0]);
    });
});
