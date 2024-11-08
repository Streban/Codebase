const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const segmentService = require('../controller/segment.controller');

const createSegment = async (req, res) => {
    try {
        const newSegment = await segmentService.createSegment(req.body);
        res.status(201).json({ status: 'success', data: newSegment });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

const getAllSegments = async (req, res) => {
    try {
        const filter = _.pick(req.query, ['_id', 'name']);
        const options = _.pick(req.query, ['sort', 'page', 'limit']);
        if (filter._id) filter._id = new ObjectId(filter._id);
        const segments = await segmentService.getAllSegments(filter, options);
        res.status(200).json({ status: 'success', data: segments });
    } catch (err) {

        res.status(404).json({ status: 'fail', message: err.message });
    }
};

const getSegmentById = async (req, res) => {
    try {
        const segment = await segmentService.getSegmentById(req.params.id);
        if (!segment) {
            return res.status(404).json({ status: 'fail', message: 'No segment found with that ID' });
        }
        res.status(200).json({ status: 'success', data: segment });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

const updateSegment = async (req, res) => {
    try {
        const updatedSegment = await segmentService.updateSegment( req.params.id, req.body );
        res.status(200).json({ status: 'success', data: updatedSegment });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

const deleteSegment = async (req, res) => {
    try {
        await segmentService.deleteSegment(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};


router.route("/").post(createSegment).get(getAllSegments);
router.route("/:id").put(updateSegment).delete(deleteSegment).get(getSegmentById)


module.exports = router;