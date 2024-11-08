const Action = require('../models/action.model');

const createAction = async (data) => {
    return await Action.create(data);
};

const getAllActions = async (filter, options) => {
    return await Action.paginate(filter, options)
};

const getActionById = async (id) => {
    return await Action.findById(id);
};

const updateAction = async (id, data) => {
    return await Action.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteAction = async (id) => {
    return await Action.findByIdAndDelete(id);
};

module.exports = {
    createAction,
    getAllActions,
    getActionById,
    updateAction,
    deleteAction
};
