const mongoose = require('mongoose');
const ActionService = require('../../apis/controller/action.controller');
const Action = require('../../apis/models/action.model');

jest.mock('../../apis/models/action.model', () => ({
    create: jest.fn(),
    paginate: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

describe('ActionServices', () => {
    it('should create a new action', async () => {
        const mockAction = {
            type: 'click',
            timestamps: new Date()
        };
        Action.create.mockResolvedValue(mockAction);

        const action = await ActionService.createAction(mockAction);

        expect(Action.create).toHaveBeenCalledWith(mockAction);
        expect(action).toEqual(mockAction);
    });




    describe('should return all actions', () => {
        it('should return all actions with pagination', async () => {
            const mockActions = {
                docs: [{
                    type: 'click',
                    timestamps: new Date()
                }],
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
            Action.paginate = jest.fn().mockResolvedValue(mockActions);

            const filter = {};
            const options = { page: 1, limit: 10, sort: { name: 1 } };

            const result = await ActionService.getAllActions(filter, options);

            expect(Action.paginate).toHaveBeenCalledWith(filter, options);
            expect(result).toEqual(mockActions);
        });
    });





    it('should return an action by ID', async () => {
        const mockAction = {
            _id: new mongoose.Types.ObjectId(),
            type: 'click',
            timestamps: new Date()
        };
        Action.findById.mockResolvedValue(mockAction);

        const action = await ActionService.getActionById(mockAction._id);

        expect(Action.findById).toHaveBeenCalledWith(mockAction._id);
        expect(action).toEqual(mockAction);
    });

    it('should update an action', async () => {
        const actionId = new mongoose.Types.ObjectId();
        const mockActionUpdate = {
            type: 'view',
            timestamps: new Date()
        };
        Action.findByIdAndUpdate.mockResolvedValue(mockActionUpdate);

        const action = await ActionService.updateAction(actionId, mockActionUpdate);

        expect(Action.findByIdAndUpdate).toHaveBeenCalledWith(actionId, mockActionUpdate, {
            new: true,
            runValidators: true
        });
        expect(action).toEqual(mockActionUpdate);
    });

    it('should delete an action', async () => {
        const actionId = new mongoose.Types.ObjectId();
        Action.findByIdAndDelete.mockResolvedValue(true);

        const result = await ActionService.deleteAction(actionId);

        expect(Action.findByIdAndDelete).toHaveBeenCalledWith(actionId);
        expect(result).toBe(true);
    });
});
