const AdminPreference = require("../models/adminPreference");


async function createAdminPreference(preference = {}) {
  try {
    const docs = await AdminPreference.create(preference);
    return docs;
  } catch (err) {
    throw err;
  }
}
async function findAdminPreference(query = {}) {
  try {
    const docs = await AdminPreference.find(query);
    return docs;
  } catch (err) {
    throw err;
  }
}



async function removeOne(id) {
  try {
    const doc = await AdminPreference.findOneAndDelete({ _id: id });
    return doc;
  } catch (err) {
    throw err;
  }
}


async function updateOne(id, data) {
  try {
    const doc = await AdminPreference.findOneAndUpdate({ _id: id }, data, { new: true })
    return doc;
  } catch (err) {
    throw err;
  }
}



async function removeAll() {
  try {
    const result = await AdminPreference.deleteMany({});
    return result;
  } catch (err) {
    throw err;
  }
}




async function getAll(filter, options) {
  try {
    const result = await AdminPreference.paginate(filter, options)
    return result;
  } catch (err) {
    throw err;
  }
}


module.exports = TableController = {
  getAll,
  removeOne,
  updateOne,
  createAdminPreference,
  findAdminPreference,
  removeAll,
};
