const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const campaignLogService = require('../controller/campaignLogs.controller');

const createCampaignLog = async (req, res) => {
    try {
        const newCampaignLog = await campaignLogService.createCampaignLog(req.body);
        res.status(201).json({ status: 'success', data: newCampaignLog });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

const getAllCampaignLogs = async (req, res) => {
    try {
        const filter = _.pick(req.query, ['_id', 'campaign','businessId']);
        const options = _.pick(req.query, ['sort', 'page', 'limit']);
        
        if (filter._id) filter._id = new ObjectId(filter._id);
        if (filter.campaign) filter.campaign = new ObjectId(filter.campaign);
        const campaignLogs = await campaignLogService.getAllCampaignLogs(filter, options);
        res.status(200).json({ status: 'success', data: campaignLogs });
    } catch (err) {

        res.status(404).json({ status: 'fail', message: err.message });
    }
};

const getCampaignLogById = async (req, res) => {
    try {
        const campaignLog = await campaignLogService.getCampaignLogById(req.params.id);
        if (!campaignLog) {
            return res.status(404).json({ status: 'fail', message: 'No campaignLog found with that ID' });
        }
        res.status(200).json({ status: 'success', data: campaignLog });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

const updateCampaignLog = async (req, res) => {
    try {
        const updatedCampaignLog = await campaignLogService.updateCampaignLog(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: updatedCampaignLog });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};



const deleteCampaignLogs = async (req, res) => {
    try {
        await campaignLogService.deleteCampaignLog(req.params.id);
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



router.route("/").post(createCampaignLog).get(getAllCampaignLogs);
router.route("/:id").put(updateCampaignLog).delete(deleteCampaignLogs).get(getCampaignLogById)


module.exports = router;