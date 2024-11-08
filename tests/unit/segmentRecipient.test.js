const mongoose = require('mongoose');
const SegmentRecipient = require('../../apis/models/segmentRecipient.model');
const segmentRecipientService = require('../../apis/controller/segmentRecipient.controller');



jest.mock('../../apis/models/segmentRecipient.model', () => ({
    create: jest.fn(),
    paginate: jest.fn(),

    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findById: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({ recipientId: '123', segmentId: '456' }),
    }),
}));

describe('SegmentRecipient Service', () => {
    const mockSegmentRecipientData = {
        _id: new mongoose.Types.ObjectId(),
        segmentId: new mongoose.Types.ObjectId(),
        recipientId: new mongoose.Types.ObjectId(),
        joinDate: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('creates a segment recipient', async () => {
        SegmentRecipient.create.mockResolvedValue(mockSegmentRecipientData);

        const result = await segmentRecipientService.createSegmentRecipient(mockSegmentRecipientData);

        expect(SegmentRecipient.create).toHaveBeenCalledWith(mockSegmentRecipientData);
        expect(result).toEqual(mockSegmentRecipientData);
    });

    it('should return a paginated list of segmentRecipient', async () => {
        const mockPaginatedResponse = {
            docs: [mockSegmentRecipientData],
            totalDocs: 1,
            limit: 10,
            totalPages: 1,
            page: 1,
            pagingCounter: 1,
            hasPrevPage: false,
            hasNextPage: false
        };
        SegmentRecipient.paginate.mockResolvedValue(mockPaginatedResponse);
        const filter = {};
        const options = { page: 1, limit: 10, sort: { startDate: -1 } };
        const segmentRecipient = await segmentRecipientService.getAllSegmentRecipients(filter, options);
        expect(SegmentRecipient.paginate).toHaveBeenCalledWith(filter, options);
        expect(segmentRecipient).toEqual(mockPaginatedResponse);
    });




    it('gets a segment recipient by ID s', async () => {
        const recipientId = '123';
        const expectedSegRec = { recipientId: '123', segmentId: '456' };

        const segRecipient = await segmentRecipientService.getSegmentRecipientById(recipientId);

        expect(SegmentRecipient.findById).toHaveBeenCalledWith(recipientId);
        expect(SegmentRecipient.findById().populate).toHaveBeenCalledWith('segmentId', 'recipientId');
        expect(segRecipient).toEqual(expectedSegRec);
    });



    it('updates a segment recipient', async () => {
        const updateData = { joinDate: new Date() };
        SegmentRecipient.findByIdAndUpdate.mockResolvedValue({
            ...mockSegmentRecipientData,
            ...updateData
        });

        const result = await segmentRecipientService.updateSegmentRecipient(mockSegmentRecipientData._id, updateData);

        expect(SegmentRecipient.findByIdAndUpdate).toHaveBeenCalledWith(mockSegmentRecipientData._id, updateData, { new: true });
        expect(result).toMatchObject(updateData);
    });

    it('deletes a segment recipient', async () => {
        SegmentRecipient.findByIdAndDelete.mockResolvedValue(mockSegmentRecipientData);

        const result = await segmentRecipientService.deleteSegmentRecipient(mockSegmentRecipientData._id);

        expect(SegmentRecipient.findByIdAndDelete).toHaveBeenCalledWith(mockSegmentRecipientData._id);
        expect(result).toEqual(mockSegmentRecipientData);
    });
});

