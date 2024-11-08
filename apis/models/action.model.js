const mongoose = require('mongoose');
const paginate = require("mongoose-paginate-v2");

const actionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['click', 'view', 'purchase'],
        required: true
    },
},{timestamps: true});
actionSchema.plugin(paginate);

const Action = mongoose.model('Action', actionSchema);

module.exports = Action;
