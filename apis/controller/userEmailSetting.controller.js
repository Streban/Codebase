const UserEmailSetting = require("../models/userEmailSettings");

const findUserEmailSettings = (query = {}) => {
  UserEmailSetting.find(query, (err, docs) => {
    if (err) {
      return Promise.reject(err);
    }

    return Promise.resolve(docs);
  });
};

const saveOtp = (userid, otp) => {
  UserEmailSetting.find();
};
async function removeOne(id) {
  try {
    const doc = await UserEmailSetting.findOneAndDelete({ _id: id });
    return doc;
  } catch (err) {
    throw err;
  }
}


const removeMany = (ids = []) => {
  UserEmailSetting.deleteMany({ _id: { $in: ids } }, (err, docs) => {
    if (err) {
      return Promise.reject(err);
    }

    return Promise.resolve(docs);
  });
};

const removeAll = () => {
  UserEmailSetting.deleteMany({}, (err, docs) => {
    if (err) {
      return Promise.reject(err);
    }

    return Promise.resolve(docs);
  });
};

async function createOne({ user, setting, email, businessId }) {
  try {
    const doc = await UserEmailSetting.create({ user, email, setting, businessId });
    return doc;
  } catch (err) {
    throw err;
  }
}



async function checkEmailSetting({ user, field }) {
  try {
    let userData = await getUserById(user)
    return Boolean(userData?.setting[field]);
  } catch (error) {
    throw error;
  }
}


const updateByUserId = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await createOne({
        user: data.user,
        email: data.email,
        setting: data.setting,
      });
      // user doesnot exist, created new one successfully.
      return resolve(user);
    } catch (error) {
      // user already exists, update it
      UserEmailSetting.findOneAndUpdate(
        { user: id },
        data,
        { upsert: false, new: true },
        (err, doc) => {
          if (!err) {
            return resolve(doc);
          }

          return reject(err);
        }
      );
    }
  });
};

const updateOne = (id, data) => {
  return new Promise((resolve, reject) => {
    UserEmailSetting.findOneAndUpdate(
      { _id: id },
      data,
      { upsert: false, new: true },
      (err, doc) => {
        if (!err) {
          return resolve(doc);
        }

        return reject(err);
      }
    );
  });
};

async function getAll() {
  try {
    const docs = await UserEmailSetting.find({});
    return docs;
  } catch (err) {
    throw err;
  }
}

async function getUserById(id) {
  try {
    const doc = await UserEmailSetting.findOne({ user: id })
    return doc;
  } catch (err) {
    throw err;
  }
}


module.exports = {
  createOne,
  updateOne,
  getAll,
  removeOne,
  updateByUserId,
  checkEmailSetting,
  getUserById
};
