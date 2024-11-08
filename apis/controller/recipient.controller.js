const Recipient = require('../models/recipient.model');

const createRecipient = async (data) => {
    return await Recipient.create(data);
};

const getAllRecipients = async (filter, options) => {
    return await Recipient.paginate(filter, options)
};

const getRecipientById = async (id) => {
    return await Recipient.findById(id);
};
const getRecipientByEmail = async (email) => {
    return await Recipient.findOne({ email })
};

const updateRecipient = async (id, data) => {
    return await Recipient.findByIdAndUpdate(id, data, { new: true });
};

const deleteRecipient = async (id) => {
    return await Recipient.findByIdAndDelete(id);
};

module.exports = {
    createRecipient,
    getAllRecipients,
    getRecipientById,
    updateRecipient,
    deleteRecipient,
    getRecipientByEmail
};
