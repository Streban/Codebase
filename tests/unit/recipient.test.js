const mongoose = require('mongoose');
const Recipient = require('../../apis/models/recipient.model');
const recipientService = require('../../apis/controller/recipient.controller');

jest.mock('../../apis/models/recipient.model', () => ({
    create: jest.fn(),
    paginate: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

describe('Recipient Service', () => {
    const mockData = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        name: 'John Doe',
        subscriptionStatus: 'subscribed'
    };

    it('creates a recipient', async () => {
        Recipient.create.mockResolvedValue(mockData);

        const recipient = await recipientService.createRecipient(mockData);

        expect(Recipient.create).toHaveBeenCalledWith(mockData);
        expect(recipient).toEqual(mockData);
    });

    it('gets all recipients with pagination', async () => {
        const mockPaginatedResult = {
            docs: [mockData],
            totalDocs: 1,
            limit: 10,
            totalPages: 1,
            page: 1
        };
        Recipient.paginate.mockResolvedValue(mockPaginatedResult);
        const filter = {};
        const options = { page: 1, limit: 10 };

        const result = await recipientService.getAllRecipients(filter, options);

        expect(Recipient.paginate).toHaveBeenCalledWith(filter, options);
        expect(result).toEqual(mockPaginatedResult);
    });

    it('gets a recipient by ID', async () => {
        Recipient.findById.mockResolvedValue(mockData);

        const recipient = await recipientService.getRecipientById(mockData._id);

        expect(Recipient.findById).toHaveBeenCalledWith(mockData._id);
        expect(recipient).toEqual(mockData);
    });

    it('gets a recipient by email', async () => {
        Recipient.findOne.mockResolvedValue(mockData);

        const recipient = await recipientService.getRecipientByEmail(mockData.email);

        expect(Recipient.findOne).toHaveBeenCalledWith({ email: mockData.email });
        expect(recipient).toEqual(mockData);
    });

    it('updates a recipient', async () => {
        const update = { name: 'Jane Doe' };
        Recipient.findByIdAndUpdate.mockResolvedValue({ ...mockData, ...update });

        const recipient = await recipientService.updateRecipient(mockData._id, update);

        expect(Recipient.findByIdAndUpdate).toHaveBeenCalledWith(mockData._id, update, { new: true });
        expect(recipient).toMatchObject(update);
    });

    it('deletes a recipient', async () => {
        Recipient.findByIdAndDelete.mockResolvedValue(mockData);

        const recipient = await recipientService.deleteRecipient(mockData._id);

        expect(Recipient.findByIdAndDelete).toHaveBeenCalledWith(mockData._id);
        expect(recipient).toEqual(mockData);
    });

    // Additional tests...
});
