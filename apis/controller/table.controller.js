
const Table = require("../models/table.model");


const createMany = (Tables = []) => {
  return new Promise((resolve, reject) => {
    Table.create(Tables, (err, docs) => {
      if (!err) {
        return resolve(docs);
      }

      return reject(err);
    });
  });
};

const findTables = (query = {}) => {
  return new Promise((resolve, reject) => {
    Table.find(query, (err, docs) => {
      if (err) {
        return reject(err);
      }

      return resolve(docs);
    });
  });
};


const removeOne = async (id) => {
  try {
    const doc = await Table.findByIdAndDelete(id);

    if (doc) {
      await Table.updateMany(
        { table_name: doc.table_name, position: { $gt: doc.position } },
        { $inc: { position: -1 } }
      );
    }

    return doc;
  } catch (err) {
    throw err; // This error should be caught by the calling function or middleware.
  }
};

// const updateOne = (id, data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!data.sticky) {
//         let table = await Table.findById(id)
//         if (!table) throw new Error('Table Not Found!');

//         if (!table.sticky) throw new Error('Table Column Already Not Sticky!');
//         let maxPositionSticky = await Table.findOne({ table_name: table.table_name, sticky: true }).sort({ position: -1 }).select('position')
//         console.log(">>>>>>>>>>>POS>>>>>>>", maxPositionSticky)
//         if (maxPositionSticky.position > 1) {
//           let finalPosition = maxPositionSticky.position
//           let result = await Table.updatePositioning(id, finalPosition);

//           if (result instanceof Error) {
//             return reject(err);
//           }
//           Table.findOneAndUpdate({ _id: id }, { position: finalPosition, sticky: false }, { new: true }, (err, doc) => {
//             if (!err) {
//               return resolve(doc);
//             }
//             return reject(err);
//           });
//         }

//       }
//       if (data.position) {
//         let result = await Table.updatePositioning(id, data.position)
//         if (result instanceof Error) {
//           return reject(err);
//         }
//       }
//       if (data.sticky && !data.position) {
//         let table = await Table.findById(id).select({ 'table_name': 1, 'sticky': 1 })
//         if (table.sticky) throw new Error('Already Sticky');
//         let maxPositionSticky = await Table.findOne({ table_name: table.table_name, sticky: true }).sort({ position: -1 }).select('position')
//         console.log(maxPositionSticky)
//         let finalPosition = maxPositionSticky ? maxPositionSticky.position + 1 : 1
//         let result = await Table.updatePositioning(id, finalPosition);
//         data.position = finalPosition
//         if (result instanceof Error) {
//           return reject(err);
//         }
//       }
//       Table.findOneAndUpdate({ _id: id }, data, { upsert: false, new: true }, (err, doc) => {
//         if (!err) {
//           return resolve(doc);
//         }
//         return reject(err);
//       });
//     } catch (err) {
//       reject(err);
//     }
//   });
// };


const updateOne = async (id, data) => {
  try {
    const table = await Table.findById(id);

    if (!table) {
      throw new Error('Table Not Found!');
    }

    if (data.sticky !== undefined) {
      if (table.sticky === data.sticky) {
        throw new Error('Table Column Already Not Sticky!');
      }
      if (!data.sticky) {
        const maxPositionSticky = await Table.findOne({ table_name: table.table_name, sticky: true }).sort({ position: -1 }).select('position');
        const finalPosition = maxPositionSticky ? maxPositionSticky.position : 0;
        await Table.updatePositioning(id, finalPosition);
      }
    }

    if (data.position !== undefined) {
      if (data.position <= 0) {
        throw new Error('Invalid Position');
      }
      await Table.updatePositioning(id, data.position);
    }

    const updatedData = { ...data };
    if (data.sticky !== undefined && !data.position) {
      updatedData.position = await calculatePosition(table.table_name, data.sticky);
    }

    const updatedTable = await Table.findOneAndUpdate({ _id: id }, updatedData, { new: true });
    return updatedTable;
  } catch (error) {
    throw error;
  }
};

async function calculatePosition(table_name, sticky) {
  if (sticky) {
    const maxPositionSticky = await Table.findOne({ table_name, sticky: true }).sort({ position: -1 }).select('position');
    return maxPositionSticky ? maxPositionSticky.position + 1 : 1;
  } else {
    const maxPositionNonSticky = await Table.findOne({ table_name, sticky: false }).sort({ position: -1 }).select('position');
    return maxPositionNonSticky ? maxPositionNonSticky.position + 1 : 1;
  }
}




const removeAll = () => {
  return new Promise((resolve, reject) => {
    Table.deleteMany({}, (err, docs) => {
      if (err) {
        return reject(err);
      }

      return resolve(docs);
    });
  });
};

const createOne = async (body) => {
  try {
    const mailTable = new Table(body);
    const doc = await mailTable.save();
    return doc;
  } catch (err) {
    throw err;
  }
};


const getAll = async (filter, options) => {
  try {
    const docs = await Table.paginate(filter, options);

    // await checkPreferenceAndModifyTable(docs, filter);
    return docs;
  } catch (err) {
    throw err;
  }
};


const getTableByName = async (query) => {
  let { table_name, userId } = query;
  try {
    let result = await Table.find({ table_name: table_name }).sort({ position: 1 }).exec();
    result = await checkPreferenceAndModifyTable(result, { table_name: table_name, userId });
    result.sort((a, b) => a.position - b.position);
    return result;
  } catch (err) {
    throw err;
  }
};



module.exports = TableController = {
  createOne,
  getAll,
  removeOne,
  updateOne,
  createMany,
  removeAll,
  getTableByName,
  findTables
};
