const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const tableSchema = new mongoose.Schema({
    table_name:{
        type:String,
    },
    column_name: {
        type:String
    },
    column_no: String,
    sticky: {
        type:Boolean,
        default:false
    },
    sticky_priority: String,
    position: {
        type:Number,
        default:1
    },
    isShow:{
        type:Boolean,
        default:true
    },
    businessId:{type: String, businessId:[true,'businessId is required']}
},{
    timestamps:true
})

tableSchema.plugin(paginate);
tableSchema.index({table_name:1, column_name:1}, {unique:true});

tableSchema.statics.updatePositioning = async function(columnId, newPosition){
    const Column = this;

    // Find the column being updated
    const columnToUpdate = await Column.findById(columnId);

    if (!columnToUpdate) {
        throw new Error('Column not found',400);
    }

    const oldPosition = columnToUpdate.position;
    const delta =  oldPosition - newPosition;
    
    // Update positions of related columns
    if(delta>0){
        await Column.updateMany(
            { table_name: columnToUpdate.table_name,position: { $gte: newPosition, $lt:oldPosition} },
            { $inc: { position: 1 } }
        );
    }else if(delta !== 0){
        await Column.updateMany(
            { table_name: columnToUpdate.table_name, position: { $gt: oldPosition, $lte:newPosition } },
            { $inc: { position: -1 } }
        );
        
    }

    return columnToUpdate;
}


tableSchema.pre('save', async function(next) {
    if (this.isNew) { // Only set default position on new documents
        const Table = this.constructor;
        const maxPositionDoc = await Table.findOne({ table_name: this.table_name })
                                         .sort({ position: -1 })
                                         .select({ position: 1 })
            if (maxPositionDoc) {
                this.position = maxPositionDoc.position + 1;
                            }
                            else
                            this.position = 1;
                }
    next();
});


module.exports = mongoose.model('Table',tableSchema);