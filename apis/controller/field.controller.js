
const Field = require("../models/field.model");

const updateOne = async (id, data) => {
  try {
    const updatedDoc = await Field.findOneAndUpdate({ _id: id }, data, { upsert: false, new: true });
    return updatedDoc;
  } catch (err) {
    throw err;
  }
};



const getAll = async (filter) => {
  try {
    const docs = await Field.find(filter)
    return docs;
  } catch (err) {
    throw err;
  }
};



const removeAll = async () => {
  try {
    const doc = await Field.deleteMany({});
    return doc;
  } catch (err) {
    throw err;
  }
};


const removeOne = async (id) => {
  try {
    const doc = await Field.findOneAndDelete({ _id: id });
    return doc;
  } catch (err) {
    throw err;
  }
};



const createOne = async (body) => {
  try {

    const doc = await Field.create(body)

    return doc;
  } catch (err) {
    throw err;
  }
};


module.exports = {
  fieldcontroller: { createOne, updateOne, removeOne, getAll, removeAll, },
};
