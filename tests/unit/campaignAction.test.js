const mongoose = require('mongoose');
const campaignActionService = require('../../apis/controller/campaignAction.controller');
const CampaignAction = require('../../apis/models/campaignAction.model');

jest.mock('../../apis/models/campaignAction.model', () => ({
    create: jest.fn(),
    paginate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({ recipientId: '123', campaignId: '456' }),
    }),
}));



describe('Campaign Action Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockCampaignActionData = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@gmail.com',
        recipientId: new mongoose.Types.ObjectId(),
        sendDate: new Date(),
        body: 'A summer sale for all summer products.',
        campaignId: new mongoose.Types.ObjectId(),
        status: 'sent',
        subject: 'Test subject'
    };

    it('should create a new campaign Action', async () => {
        CampaignAction.create.mockResolvedValue(mockCampaignActionData);
        const campaignAction = await campaignActionService.createAction(mockCampaignActionData);
        expect(CampaignAction.create).toHaveBeenCalledWith(mockCampaignActionData);
        expect(campaignAction).toEqual(mockCampaignActionData);
    });

    it('should return a paginated list of campaigns', async () => {
        const mockPaginatedResponse = {
            docs: [mockCampaignActionData],
            totalDocs: 1,
            limit: 10,
            totalPages: 1,
            page: 1,
            pagingCounter: 1,
            hasPrevPage: false,
            hasNextPage: false
        };
        CampaignAction.paginate.mockResolvedValue(mockPaginatedResponse);
        const filter = {};
        const options = { page: 1, limit: 10, sort: { startDate: -1 } };
        const campaignActions = await campaignActionService.getAllActions(filter, options);
        expect(CampaignAction.paginate).toHaveBeenCalledWith(filter, options);
        expect(campaignActions).toEqual(mockPaginatedResponse);
    });


    it('should return a campaign for a given id', async () => {
        const campaignActionId = '123';
        const expectedCampaignAction = { recipientId: '123', campaignId: '456' };

        const campaignAction = await campaignActionService.getActionById(campaignActionId);

        expect(CampaignAction.findById).toHaveBeenCalledWith(campaignActionId);
        expect(CampaignAction.findById().populate).toHaveBeenCalledWith('recipientId', 'campaignId');
        expect(campaignAction).toEqual(expectedCampaignAction);
    });
    it('should update a campaign Action by ID', async () => {
        const update = { status: 'failed' };
        CampaignAction.findByIdAndUpdate.mockResolvedValue({ ...mockCampaignActionData, ...update });
        const updatedCampaignAction = await campaignActionService.updateAction(mockCampaignActionData._id, update);
        expect(CampaignAction.findByIdAndUpdate).toHaveBeenCalledWith(mockCampaignActionData._id, update, { new: true, runValidators: true });
        expect(updatedCampaignAction.status).toEqual(update.status);
    });


    it('should delete the campaign', async () => {
        const campaignActionId = mockCampaignActionData._id
        CampaignAction.findByIdAndDelete.mockResolvedValue(mockCampaignActionData[0]);

        const deletedCampaignAction = await campaignActionService.deleteAction(campaignActionId);

        expect(CampaignAction.findByIdAndDelete).toHaveBeenCalledWith(campaignActionId);
        expect(deletedCampaignAction).toEqual(mockCampaignActionData[0]);
    });
});
