const mongoose = require('mongoose');
const fieldsSchema = mongoose.Schema({
    name:String,
    businessId:{type: String, required: [true,'businessId is required']}
})

module.exports = mongoose.model("Field", fieldsSchema);