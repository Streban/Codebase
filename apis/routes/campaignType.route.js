const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')


const campaignTypeService = require('../controller/campaignType.controller');

const createCampaignType = async (req, res) => {
    try {
        const newCampaignType = await campaignTypeService.createCampaignType(req.body);
        res.status(201).json({
            status: 'success',
            data: newCampaignType
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};


async function getAllCampaignTypes(req, res) {
    try {
        const filter = _.pick(req.query, ['_id', 'name']);
        const options = _.pick(req.query, ['sort', 'page', 'limit']);
        if (filter._id) filter._id = new ObjectId(filter._id);

        const docs = await campaignTypeService.getAllCampaignTypes(filter, options);
        return res.json({ data: docs });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

const getCampaignTypeById = async (req, res) => {
    try {
        const campaignType = await campaignTypeService.getCampaignTypeById(req.params.id);
        if (!campaignType) {
            return res.status(404).json({
                status: 'fail',
                message: 'No campaignType found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: campaignType
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

const updateCampaignType = async (req, res) => {
    try {
        const updatedCampaignType = await campaignTypeService.updateCampaignType(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: updatedCampaignType
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

const deleteCampaignType = async (req, res) => {
    try {
        await campaignTypeService.deleteCampaignType(req.params.id);
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



router.route("/").post(createCampaignType).get(getAllCampaignTypes);
router.route("/:id").put(updateCampaignType).delete(deleteCampaignType).get(getCampaignTypeById)


module.exports = router;
