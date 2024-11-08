
const UserPreference = require("../models/userPreference");

const createUserPreference = async (preference = {}) => {
  try {
    const docs = await UserPreference.create(preference);
    return docs;
  } catch (err) {
    throw err;
  }
};

const findUserPreference = async (query = {}) => {
  try {
    const docs = await UserPreference.find(query);
    return docs;
  } catch (err) {
    throw err;
  }
};


const removeOne = async (id) => {
  try {
    const doc = await UserPreference.findOneAndDelete({ _id: id });
    return doc;
  } catch (err) {
    throw err;
  }
};

const updateOne = async (id, data) => {
  try {
    const doc = await UserPreference.findOneAndUpdate({ _id: id }, data, { new: true })
    return doc;
  } catch (err) {
    throw err;
  }
};


const removeAll = async () => {
  try {
    const result = await UserPreference.deleteMany({});
    return result;
  } catch (err) {
    throw err;
  }
};



async function getAll(filter, options) {
  try {

    const d = await UserPreference.find({})

    console.log("----------", d, "--------------");

    const result = await UserPreference.paginate(filter, options)
    return result;
  } catch (err) {
    throw err;
  }
}

module.exports = TableController = {
  getAll,
  removeOne,
  updateOne,
  createUserPreference,
  findUserPreference,
  removeAll,
};
