const mongoose = require('mongoose');
const SegmentService = require('../../apis/controller/segment.controller');
const Segment = require('../../apis/models/segment.model');

// Mock the Segment model methods
jest.mock('../../apis/models/segment.model', () => ({
    create: jest.fn(),
    paginate: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));



describe('SegmentServices', () => {
    it('should create a new segment', async () => {
        const mockSegment = { name: 'New Segment', criteriaDescription: 'Description of the new segment' };
        Segment.create.mockResolvedValue(mockSegment);

        const segment = await SegmentService.createSegment(mockSegment);

        expect(Segment.create).toHaveBeenCalledWith(mockSegment);
        expect(segment).toEqual(mockSegment);
    });

    describe('should return all segments', () => {
        it('should return all segments with pagination', async () => {
            const mockSegments = {
                docs: [{ name: 'Segment 1', criteriaDescription: 'Description 1' }],
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
            Segment.paginate = jest.fn().mockResolvedValue(mockSegments);

            const filter = {};
            const options = { page: 1, limit: 10, sort: { name: 1 } };

            const result = await SegmentService.getAllSegments(filter, options);

            expect(Segment.paginate).toHaveBeenCalledWith(filter, options);
            expect(result).toEqual(mockSegments);
        });
    });


    it('should return a segment by ID', async () => {
        const mockSegment = { _id: new mongoose.Types.ObjectId(), name: 'Segment 1', criteriaDescription: 'Description 1' };
        Segment.findById.mockResolvedValue(mockSegment);

        const segment = await SegmentService.getSegmentById(mockSegment._id);

        expect(Segment.findById).toHaveBeenCalledWith(mockSegment._id);
        expect(segment).toEqual(mockSegment);
    });

    it('should update a segment', async () => {
        const segmentId = new mongoose.Types.ObjectId();
        const mockSegmentUpdate = { name: 'Updated Segment', criteriaDescription: 'Updated Description' };
        Segment.findByIdAndUpdate.mockResolvedValue(mockSegmentUpdate);

        const segment = await SegmentService.updateSegment(segmentId, mockSegmentUpdate);

        expect(Segment.findByIdAndUpdate).toHaveBeenCalledWith(segmentId, mockSegmentUpdate, {
            new: true,
            runValidators: true
        });
        expect(segment).toEqual(mockSegmentUpdate);
    });

    it('should delete a segment', async () => {
        const segmentId = new mongoose.Types.ObjectId();
        Segment.findByIdAndDelete.mockResolvedValue(true);

        const result = await SegmentService.deleteSegment(segmentId);

        expect(Segment.findByIdAndDelete).toHaveBeenCalledWith(segmentId);
        expect(result).toBe(true);
    });
});
