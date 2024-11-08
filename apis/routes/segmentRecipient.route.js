const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const segmentRecipientService = require('../controller/segmentRecipient.controller');

const createSegmentRecipient = async (req, res) => {
    try {
        const segmentRecipient = await segmentRecipientService.createSegmentRecipient(req.body);
        res.status(201).json({ data: segmentRecipient });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllSegmentRecipients = async (req, res) => {
    try {
        const filter = _.pick(req.query, ['_id', 'segmentId', 'recipientId']);
        const options = _.pick(req.query, ['sort', 'page', 'limit']);
        if (filter._id) filter._id = new ObjectId(filter._id);
        const segmentRecipients = await segmentRecipientService.getAllSegmentRecipients(filter, options);
        res.status(200).json({ data: segmentRecipients });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSegmentRecipientById = async (req, res) => {
    try {
        const segmentRecipient = await segmentRecipientService.getSegmentRecipientById(req.params.id);
        if (!segmentRecipient) {
            return res.status(404).json({ message: 'SegmentRecipient not found' });
        }
        res.status(200).json({ data: segmentRecipient });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getSegmentRecipientBySegmentId = async (req, res) => {
    try {
        const segmentRecipients = await segmentRecipientService.getSegmentRecipientBySegmentId(req.params.segmentId);
        res.status(200).json({ data: segmentRecipients });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getSegmentRecipientByRecipientId = async (req, res) => {
    try {
        const segmentRecipients = await segmentRecipientService.getSegmentRecipientByrecipientId(req.params.recipientId);
        res.status(200).json({ data: segmentRecipients });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSegmentRecipient = async (req, res) => {
    try {
        const updatedSegmentRecipient = await segmentRecipientService.updateSegmentRecipient(req.params.id, req.body);
        res.status(200).json({ data: updatedSegmentRecipient });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSegmentRecipient = async (req, res) => {
    try {
        await segmentRecipientService.deleteSegmentRecipient(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

router.route("/").post(createSegmentRecipient).get(getAllSegmentRecipients);
router.route("/:id").put(updateSegmentRecipient).delete(deleteSegmentRecipient).get(getSegmentRecipientById)

router.route("/segment/:segmentId").get(getSegmentRecipientBySegmentId)
router.route("/recipient/:recipientId").get(getSegmentRecipientByRecipientId)


module.exports = router;