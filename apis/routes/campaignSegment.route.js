const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const campaignSegmentService = require('../../apis/controller/campaignSegment.controller');

const createCampaignSegment = async (req, res) => {
    try {
        const newCampaignSegment = await campaignSegmentService.createCampaignSegment(req.body);
        res.status(201).json({ status: 'success', data: newCampaignSegment });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

const getAllCampaignSegments = async (req, res) => {

    try {
        const filter = _.pick(req.query, ['_id', 'campaignId', 'segmentId']);
        const options = _.pick(req.query, ['sort', 'page', 'limit']);
        if (filter._id) filter._id = new ObjectId(filter._id);
        const campaignSegments = await campaignSegmentService.getAllCampaignSegments(filter, options);
        res.status(200).json({ status: 'success', data: campaignSegments });
    } catch (err) {

        console.log("errrrrrrrrrrrrrrrrrrrrr", err);
        res.status(404).json({ status: 'fail', message: err.message });
    }

};

const getCampaignSegmentById = async (req, res) => {
    try {
        const campaignSegment = await campaignSegmentService.getCampaignSegmentById(req.params.id);
        if (!campaignSegment) {
            return res.status(404).json({ status: 'fail', message: 'No campaignSegment found with that ID' });
        }
        res.status(200).json({ status: 'success', data: campaignSegment });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

const updateCampaignSegment = async (req, res) => {
    try {
        const updatedCampaignSegment = await campaignSegmentService.updateCampaignSegment(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: updatedCampaignSegment });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

const deleteCampaignSegment = async (req, res) => {
    try {
        await campaignSegmentService.deleteCampaignSegment(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};




router.route("/").post(createCampaignSegment).get(getAllCampaignSegments);
router.route("/:id").put(updateCampaignSegment).delete(deleteCampaignSegment).get(getCampaignSegmentById)


module.exports = router;