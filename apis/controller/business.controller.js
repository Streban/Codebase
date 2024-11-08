// const {
//   checkPreferenceAndModifyTable,
// } = require("../../utils/checkPreference");
// const AdminPreference = require("../models/adminPreference");
const Business = require("../models/business.model");

const createMany = (Tables = []) => {
  return new Promise((resolve, reject) => {
    Business.create(Tables, (err, docs) => {
      if (!err) {
        return resolve(docs);
      }

      return reject(err);
    });
  });
};

const findBusinesses = (query = {}) => {
  return new Promise((resolve, reject) => {
    Business.find(query, (err, docs) => {
      if (err) {
        return reject(err);
      }

      return resolve(docs);
    });
  });
};

const getBusinessBalance = async (businessId) => {
  const business = await Business.findOne({ businessId });
  return business;
};

const removeOne = (id) => {
  return new Promise((resolve, reject) => {
    Business.findOneAndDelete({ _id: id }, async (err, doc) => {
      if (err) {
        return reject(err);
      }
      return resolve(doc);
    });
  });
};

const updateOne = async (id, data) => {
    const doc = await Business.findOneAndUpdate({ _id: id }, data, {
      upsert: false,
      new: true,
    });
    return doc;
};

const updateBalance = async (filter, data) => {
    const doc = await Business.findOneAndUpdate(filter, data, {
      upsert: false,
      new: true,
    });
    return doc;
};

const removeAll = () => {
  return new Promise((resolve, reject) => {
    Business.deleteMany({}, (err, docs) => {
      if (err) {
        return reject(err);
      }

      return resolve(docs);
    });
  });
};

const createOne = async (body) => {
  try {
    const doc = await Business.create(body);
    return doc;
  } catch (err) {
    throw err;
  }
};

async function getAll(filter, options) {
  try {
    const docs = await Business.paginate(filter, options);
    // checkPreferenceAndModifyTable(docs, filter);
    return docs;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createOne,
  getAll,
  removeOne,
  updateOne,
  updateBalance,
  createMany,
  removeAll,
  getBusinessBalance,
};
