const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const recipientService = require('../../apis/controller/recipient.controller');

const createRecipient = async (req, res) => {
    try {
        const recipient = await recipientService.createRecipient(req.body);
        res.status(201).json({ data: recipient });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// assign segments to the recipient 
const assignSegment = async (req, res) => {
    const body_segment = req.body.segments;
    const recipient_segment = await this.recipientService.assignSegment(body_segment);
    res.status(200).json({data:recipient_segment}); 
}

const getAllRecipients = async (req, res) => {
    try {

        const filter = _.pick(req.query, ['_id', 'name', 'email', 'subscriptionStatus']);
        const options = _.pick(req.query, ['sort', 'page', 'limit']);
        if (filter._id) filter._id = new ObjectId(filter._id);
        const recipients = await recipientService.getAllRecipients(filter, options);
        res.status(200).json({ data: recipients });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getRecipientById = async (req, res) => {
    try {
        const recipient = await recipientService.getRecipientById(req.params.id);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }
        res.status(200).json({ data: recipient });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
const getRecipientByEmail = async (req, res) => {
    try {
        const recipient = await recipientService.getRecipientByEmail(req.body.email);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }
        res.status(200).json({ data: recipient });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateRecipient = async (req, res) => {
    try {
        const updatedRecipient = await recipientService.updateRecipient(req.params.id, req.body);
        res.status(200).json({ data: updatedRecipient });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRecipient = async (req, res) => {
    try {
        await recipientService.deleteRecipient(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



router.route("/").post(createRecipient).get(getAllRecipients);
router.route("/:id").put(updateRecipient).delete(deleteRecipient).get(getRecipientById)
router.route("/email/:email").get(getRecipientByEmail)
router.route("/assignSegment").get(assignSegment)



module.exports = router;