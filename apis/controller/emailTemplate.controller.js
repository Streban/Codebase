const EmailTemplate = require("../models/emailTemplate");

const createMany = (templates = []) => {
  return new Promise((resolve, reject) => {
    EmailTemplate.create(templates, (err, docs) => {
      if (!err) {
        return resolve(docs);
      }

      return reject(err);
    });
  });
};

const findEmailTemplates = (query = {}) => {
  return new Promise((resolve, reject) => {
    EmailTemplate.find(query, (err, docs) => {
      if (err) {
        return reject(err);
      }

      return resolve(docs);
    });
  });
};

const findOneByShortCode = (shortCode = "") => {
  return new Promise((resolve, reject) => {
    EmailTemplate.findOne({ shortCode })
      .lean()
      .exec((err, doc) => {
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
  });
};

// const findOneByBusinessId = (filter) => {
//   return new Promise((resolve, reject) => {
//     EmailTemplate.findOne(filter)
//       .lean()
//       .exec((err, doc) => {
//         if (err) {
//           return reject(err);
//         }
//         return resolve(doc);
//       });
//   });
// };


const findOneByBusinessId = async (filter) => {
    const doc = await EmailTemplate.findOne(filter)
    return doc;
};


const findOneByFilter = (filter) => {
  return new Promise((resolve, reject) => {
    EmailTemplate.findOne(filter)
      .lean()
      .exec((err, doc) => {
        if (err) {
          return reject(err);
        }
        return resolve(doc);
      });
  });
};

const removeOne = (id) => {
  return new Promise((resolve, reject) => {
    EmailTemplate.findOneAndDelete({ _id: id }, (err, doc) => {
      if (err) {
        return reject(err);
      }

      return resolve(doc);
    });
  });
};

const updateOne = (id, data) => {
  return new Promise((resolve, reject) => {
    EmailTemplate.findOneAndUpdate({ _id: id }, data, { upsert: false, new: true }, (err, doc) => {
      if (!err) {
        return resolve(doc);
      }

      return reject(err);
    });
  });
};

const removeMany = (ids = []) => {
  return new Promise((resolve, reject) => {
    EmailTemplate.deleteMany({ _id: { $in: ids } }, (err, docs) => {
      if (err) {
        return reject(err);
      }

      return resolve(docs);
    });
  });
};

const removeAll = (templateIds) => {
  return new Promise((resolve, reject) => {
    EmailTemplate.deleteMany({_id: { $in: templateIds }}, (err, docs) => {
      if (err) {
        return reject(err);
      }

      return resolve(docs);
    });
  });
};

const createOne = ({ fields, template, title, shortCode, type, businessId }) => {
  const mailTemplate = new EmailTemplate({
    title,
    fields,
    template,
    shortCode,
    type,
    businessId
  });

  return new Promise((resolve, reject) => {
    mailTemplate.save((err, doc) => {
      if (!err) {
        return resolve(doc);
      }

      return reject(err);
    });
  });
};

function getAll(filter, options) {
  return new Promise((resolve, reject) => {
    EmailTemplate.paginate(filter, options, (err, docs) => {
      if (err) {
        return reject(err);
      }
      return resolve(docs);
    });
  });
}

module.exports = EmailTemplateController = {
  createOne,
  getAll,
  removeOne,
  updateOne,
  findOneByShortCode,
  findOneByBusinessId,
  findOneByFilter,
  createMany,
  removeAll,
};
