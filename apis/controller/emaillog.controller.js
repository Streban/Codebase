const EmailLog = require("../models/emaillog");



const findEmailLogs = async (query = {}) => {
  try {
    const logs = await EmailLog.find(query).exec()
    return logs
  } catch (err) {
    throw new Error("Failed to retrieve data")
  }
}




const removeOne = (id) => {
  try {
    const log = EmailLog.findOneAndDelete({ _id: id }).exec()
    return log
  } catch (err) {
    throw new Error("Deletion failed");
  }
}


const removeMany = async (ids = []) => {
  try {
    const result = await EmailLog.deleteMany({ _id: { $in: ids } }).exec();
    return result;
  } catch (err) {
    throw new Error("Deletion failed: " + err.message);
  }
}

const removeAll = async () => {
  try {
    const result = await EmailLog.deleteMany({}).exec();
    return result;
  } catch (err) {
    throw new Error("Deletion failed: " + err.message);
  }
};


const createOne = async ({
  user,
  emails,
  status,
  type,
  data = null,
  messageId = "",
  template = "",
  businessId
}) => {
  try {
    const emailLog = new EmailLog({
      user,
      emails,
      status,
      type,
      messageId,
      data,
      template,
      businessId
    });

    const doc = await emailLog.save();
    return doc;
  } catch (err) {
    throw err;
  }
};


module.exports = {
  createOne,
  findEmailLogs,
  removeOne,
  removeMany,
  removeAll
};
