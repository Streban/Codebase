const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const CampaignActionService = require('../controller/campaignAction.controller');

const createAction = async (req, res) => {
    try {
        const action = await CampaignActionService.createAction(req.body);
        res.status(201).json({ data: action });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllActions = async (req, res) => {
    try {
        const filter = _.pick(req.query, ['_id', 'email', 'sendDate', 'recipientId', 'campaignId', 'status']);
        const options = _.pick(req.query, ['sort', 'page', 'limit']);
        if (filter._id) filter._id = new ObjectId(filter._id);
        const actions = await CampaignActionService.getAllActions(filter, options);
        res.status(200).json({ data: actions });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getActionById = async (req, res) => {
    try {
        const action = await CampaignActionService.getActionById(req.params.id);
        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }
        res.status(200).json({ data: action });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateAction = async (req, res) => {
    try {
        const updatedAction = await CampaignActionService.updateAction(req.params.id, req.body);
        res.status(200).json({ data: updatedAction });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAction = async (req, res) => {
    try {
        await CampaignActionService.deleteAction(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



router.route("/").post(createAction).get(getAllActions);
router.route("/:id").put(updateAction).delete(deleteAction).get(getActionById)


module.exports = router;