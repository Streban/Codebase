const campaignLogService = require('../../apis/controller/campaignLogs.controller');
const CampaignLog = require('../../apis/models/campaignLogs.model');

// Mocking the Mongoose Model methods
jest.mock('../../apis/models/campaignLogs.model', () => ({
    create: jest.fn(),
    paginate: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

describe('CampaignLogService', () => {
    it('should create a new campaign log', async () => {
        const mockCampaignLog = { campaign: '123', action: 'action', timestamps: new Date(), duration: new Date() };
        CampaignLog.create.mockResolvedValue(mockCampaignLog);

        const campaignLog = await campaignLogService.createCampaignLog(mockCampaignLog);

        expect(CampaignLog.create).toHaveBeenCalledWith(mockCampaignLog);
        expect(campaignLog).toEqual(mockCampaignLog);
    });



    describe('getAllCampaignTypes', () => {
        it('should return all campaign types with pagination', async () => {
            const mockCampaignTypes = {
                docs: [
                    { campaign: '123', action: 'action1', timestamps: new Date(), duration: new Date() },
                    { campaign: '456', action: 'action2', timestamps: new Date(), duration: new Date() },
                ],
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
            CampaignLog.paginate = jest.fn().mockResolvedValue(mockCampaignTypes);

            const filter = {};
            const options = { page: 1, limit: 10, sort: { name: 1 } };

            const result = await campaignLogService.getAllCampaignLogs(filter, options);

            expect(CampaignLog.paginate).toHaveBeenCalledWith(filter, options);
            expect(result).toEqual(mockCampaignTypes);
        });
    });

    it('should return a campaign log by ID', async () => {
        const mockCampaignLog = { _id: '123', campaign: '123', action: 'action', timestamps: new Date(), duration: new Date() };
        CampaignLog.findById.mockResolvedValue(mockCampaignLog);

        const campaignLog = await campaignLogService.getCampaignLogById('123');

        expect(CampaignLog.findById).toHaveBeenCalledWith('123');
        expect(campaignLog).toEqual(mockCampaignLog);
    });

    it('should update and return the campaign log', async () => {
        const mockCampaignLog = { _id: '123', campaign: '123', action: 'updatedAction', timestamps: new Date(), duration: new Date() };
        CampaignLog.findByIdAndUpdate.mockResolvedValue(mockCampaignLog);

        const campaignLog = await campaignLogService.updateCampaignLog('123', { action: 'updatedAction' });

        expect(CampaignLog.findByIdAndUpdate).toHaveBeenCalledWith('123', { action: 'updatedAction' }, { new: true, runValidators: true });
        expect(campaignLog).toEqual(mockCampaignLog);
    });

    it('should delete the campaign log', async () => {
        CampaignLog.findByIdAndDelete.mockResolvedValue({ _id: '123', campaign: '123', action: 'action', timestamps: new Date(), duration: new Date() });

        const campaignLog = await campaignLogService.deleteCampaignLog('123');

        expect(CampaignLog.findByIdAndDelete).toHaveBeenCalledWith('123');
        expect(campaignLog).toHaveProperty('_id', '123');
    });
});

