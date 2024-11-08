const { createTransporter } = require("../../config");
const { TYPE } = require("../../constants");
const EmailCredentialsTemplate = require("../models/credentials.model");

const updateOne = async (id, data) => {
  try {
    const doc = await EmailCredentialsTemplate.findOneAndUpdate({ _id: id }, data, { upsert: false, new: true });

    console.log("-----------doc", doc)
    return doc;
  } catch (err) {
    throw err;
  }
};


const getAllUnEncrypted = () => {
  return new Promise((resolve, reject) => {
    EmailCredentialsTemplate.find({})
      .lean(true)
      .exec((err, docs) => {
        if (err) {
          return reject(err);
        }

        return resolve(docs);
      });
  });
};
const getAll = async (filter, options) => {
  try {
    console.log("EETERD");
    let docs = await EmailCredentialsTemplate.paginate(filter, options);
    console.log("Pagination>>>>", docs);

    // Mask the password in each document
    docs.docs = docs.docs.map((itm) => {
      console.log("item", itm);
      itm.auth.pass = "********" + itm.auth.pass.slice(-3);
      return itm;
    });

    console.log("FINALLY", docs);
    return docs;
  } catch (err) {
    console.log(err);
    throw err; // Rethrowing the error here; make sure to handle it in the calling context
  }
};


const getOne = (country, type) => {
  return new Promise((resolve, reject) => {
    EmailCredentialsTemplate.findOne({ country, type }, (err, doc) => {
      if (err) {
        return reject(err)
      }
      console.log(doc);
      resolve(doc);
    });
  })
}

const removeAll = () => {
  return new Promise((resolve, reject) => {
    EmailCredentialsTemplate.remove({}, (err, doc) => {
      if (err) {
        return reject(err);
      }

      return resolve(doc);
    });
  });
};

const removeOne = async (id) => {
  try {
    const doc = await EmailCredentialsTemplate.findOneAndDelete({ _id: id });
    return doc;
  } catch (err) {
    throw err;
  }
};

const createMany = (credentials = []) => {
  for (const cred of credentials) {
    Credentails.addCredentials(cred);
  }
  return new Promise((resolve, reject) => {
    EmailCredentialsTemplate.create(credentials, (err, docs) => {
      if (!err) {
        return resolve(docs);
      }


      return reject(err);
    });
  });
};

const createOne = (body) => {

  const mailTemplate = new EmailCredentialsTemplate(body);
  Credentails.addCredentials(body);
  return new Promise((resolve, reject) => {
    mailTemplate.save((err, doc) => {
      if (!err) {
        return resolve(doc);
      }
      return reject(err);
    });
  });
};

class CredentialsClass {
  credentials;
  retries;

  constructor() {
    this.credentials = [];
    this.retries = 0;
  }

  init() {
    this.retries++;
    return new Promise((resolve, reject) => {
      getAllUnEncrypted()
        .then((docs) => {
          this.setCredentials(docs);
          return resolve(this.getAllCredentials());
        })
        .catch((err) => {
          console.log("initailization error:", err);
          if (this.retries < 5) {
            this.init();
          } else {
            return reject(err);
          }
        });
    });
  }

  addCredentials(cred) {
    this.credentials.push(cred);
  }

  removeCredentials(id) {
    this.credentials = this.credentials.filter((cred) => cred._id !== id);
  }

  setCredentials(creds = []) {
    this.credentials = creds;
  }

  getCredentialsByCountry(country = "UK", type = "OTP") {
    let cred = this.credentials.find((cred) => cred.country.toLowerCase() === country.toLowerCase());
    console.log("debug", country, type, cred);
    return cred;
  }

  getCredentialsByFilter(filter = { country: "UK", type: "OTP", businessId: '' }) {
    const { country, type, businessId } = filter;
    let cred = this.credentials.find((cred) => cred.country.toLowerCase() === country.toLowerCase() && cred.type.toLowerCase() === type.toLowerCase() && cred.businessId == businessId);
    console.log("debug businessId", country, type, businessId, cred);
    return cred;
  }

  getAllCredentials() {
    return this.credentials;
  }

  async getTransporter(country = "UK", type = "Marketing", businessId) {
    return new Promise((resolve, reject) => {
      if (!["uk", "pk"].includes(country.toLowerCase())) {
        return reject('No Such Country!');
      }

      // if (!Object.keys["otp", "marketing","booking","invitation","business","payment",""].includes(type.toLowerCase())) {
      if (!Object.prototype.hasOwnProperty.call(TYPE, type.toUpperCase())) {
        return reject('No Type Matched!');
      }
      let cred;
      if (businessId) {
        cred = this.getCredentialsByFilter({ country, type, businessId });
      }
      if (!cred) {
        cred = this.getCredentialsByCountry(country, type);
      }
      let transporter = createTransporter({ server: cred.server, auth: { user: cred.auth.user, pass: cred.auth.pass }, port: cred.port, secure: cred.secure });
      return resolve(transporter);
    });
  }
}

const Credentails = new CredentialsClass();

module.exports = {
  CredentailsController: { createOne, updateOne, removeOne, getAll, createMany, removeAll, getOne },
  Credentails, getAllUnEncrypted, CredentialsClass
};
