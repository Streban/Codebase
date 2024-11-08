const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const segmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    criteriaDescription: {
        type: String
    },
    type:{
        type: String,
    },
    // business: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Buisness',
    //     required: false
    // },
    filter:[{
        name:{
            type: String,
        },
        value:{
            type: String,
        }
    }],
    businessId:{
        type: String,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});


segmentSchema.plugin(mongoosePaginate);

const Segment = mongoose.model('Segment', segmentSchema);

module.exports = Segment;
