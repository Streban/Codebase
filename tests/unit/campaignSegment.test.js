const mongoose = require('mongoose');
const campaignSegmentService = require('../../apis/controller/campaignSegment.controller')
const CampaignSegment = require('../../apis/models/campaignSegment.model');

jest.mock('../../apis/models/campaignSegment.model', () => ({
    create: jest.fn(),
    paginate: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));


describe('CampaignSegmentService', () => {
    const mockCampaignSegments = [
        { _id: new mongoose.Types.ObjectId(), campaignId: new mongoose.Types.ObjectId(), segmentId: new mongoose.Types.ObjectId(), assignDate: new Date() },
    ];

    it('should create a new campaign segment', async () => {
        const newCampaignSegmentData = { campaignId: new mongoose.Types.ObjectId(), segmentId: new mongoose.Types.ObjectId(), assignDate: new Date() };
        CampaignSegment.create.mockResolvedValue(newCampaignSegmentData);

        const campaignSegment = await campaignSegmentService.createCampaignSegment(newCampaignSegmentData);

        expect(CampaignSegment.create).toHaveBeenCalledWith(newCampaignSegmentData);
        expect(campaignSegment).toEqual(newCampaignSegmentData);
    });






    it('should return all Campaign Segment with pagination', async () => {
        const mockCampaignTypes = {
            docs: [
                { campaignId: new mongoose.Types.ObjectId(), segmentId: new mongoose.Types.ObjectId(), assignDate: new Date() },
                { campaignId: new mongoose.Types.ObjectId(), segmentId: new mongoose.Types.ObjectId(), assignDate: new Date() },
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
        // Mock paginate with populate
        CampaignSegment.paginate = jest.fn().mockImplementation((filter, options) => {
            return Promise.resolve(mockCampaignTypes);
        });

        const filter = {};
        const options = { page: 1, limit: 10, sort: { name: 1 }, populate: ['campaignId', 'segmentId'] };

        const result = await campaignSegmentService.getAllCampaignSegments(filter, options);

        expect(CampaignSegment.paginate).toHaveBeenCalledWith(filter, options);
        expect(result).toEqual(mockCampaignTypes);
    });


    // it('should retrieve a campaign segment by ID', async () => {
    //     const campaignSegmentId = new mongoose.Types.ObjectId();
    //     const mockCampaignSegment = {
    //         _id: campaignSegmentId,
    //         campaignId: new mongoose.Types.ObjectId(),
    //         segmentId: new mongoose.Types.ObjectId(),
    //         assignDate: new Date(),
    //     };

    //     CampaignSegment.findById.mockImplementation(() => ({
    //         populate: jest.fn().mockReturnThis(),
    //     }));

    //     await campaignSegmentService.getCampaignSegmentById(campaignSegmentId.toString());

    //     expect(CampaignSegment.findById).toHaveBeenCalledWith(campaignSegmentId.toString());
    // });


    // Test for updateCampaignSegment


    it('should update and return the campaign segment', async () => {
        const campaignSegmentId = mockCampaignSegments[0]._id;
        const updatedData = { assignDate: new Date() };
        CampaignSegment.findByIdAndUpdate.mockResolvedValue(updatedData);

        const updatedCampaignSegment = await campaignSegmentService.updateCampaignSegment(campaignSegmentId, updatedData);

        expect(CampaignSegment.findByIdAndUpdate).toHaveBeenCalledWith(campaignSegmentId, updatedData, { new: true, runValidators: true });
        expect(updatedCampaignSegment).toEqual(updatedData);
    });

    // Test for deleteCampaignSegment
    it('should delete the campaign segment', async () => {
        const campaignSegmentId = mockCampaignSegments[0]._id;
        CampaignSegment.findByIdAndDelete.mockResolvedValue(mockCampaignSegments[0]);

        const deletedCampaignSegment = await campaignSegmentService.deleteCampaignSegment(campaignSegmentId);

        expect(CampaignSegment.findByIdAndDelete).toHaveBeenCalledWith(campaignSegmentId);
        expect(deletedCampaignSegment).toEqual(mockCampaignSegments[0]);
    });
});


