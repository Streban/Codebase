const Segment = require('../models/segment.model')

const createSegment = async (data) => {
    return await Segment.create(data);
};

const getAllSegments = async (filter, options) => {
    return await Segment.paginate(filter, options);
};

const getSegmentById = async (id) => {
    return await Segment.findById(id);
};

const updateSegment = async (id, data) => {
    return await Segment.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteSegment = async (id) => {
    return await Segment.findByIdAndDelete(id);
};

module.exports = {
    createSegment,
    getAllSegments,
    getSegmentById,
    updateSegment,
    deleteSegment
};
