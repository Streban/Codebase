const Preference = require("../models/preference.model");

const updateOne = (id, data) => {
  return new Promise((resolve, reject) => {
    Preference.findOneAndUpdate({ _id:id }, data, { upsert: true, new: true }, (err, doc) => {
      if (!err) {
        return resolve(doc);
      }

      return reject(err);
    });
  });
};

const getAll = (filter, options) => {
  return new Promise((resolve, reject) => {
    Preference.paginate(filter,options,(err, docs) => {
        if (err) {
          return reject(err);
        }
        return resolve(docs);
      });
  });
};

const getOne = (filter) =>{
  return new Promise((resolve,reject)=>{
    Preference.findOne(filter,(err,doc)=>{
      if(err){
        return reject(err)
      }
      resolve(doc);
    });
  })
}

const removeAll = () => {
  return new Promise((resolve, reject) => {
    Preference.remove({}, (err, doc) => {
      if (err) {
        return reject(err);
      }

      return resolve(doc);
    });
  });
};

const removeOne = (id) => {
  return new Promise((resolve, reject) => {
    Preference.findOneAndDelete({ _id: id }, (err, doc) => {
      if (err) {
        return reject(err);
      }

      return resolve(doc);
    });
  });
};

const createOne = (body) => {
  const preference = new Preference(body);

  return new Promise((resolve, reject) => {
    preference.save((err, doc) => {
      if (!err) {
        return resolve(doc);
      }     
      return reject(err);
    });
  });
};

const preferenceRestrictedTypeMail = async (data) => {
  const list = await Preference.find({email:{$in:data.mails},restricted:true, type:data.type})
  return list;
}

const checkPreference = async ({email,type, businessId}) => {
  console.log("checkPreference??",email,type);
  const preference = await Preference.findOne({email, type, businessId});
  console.log("preferenceDoc??",preference);
  let flag = false
    if(preference?.restricted){
      flag = true
    }
    return flag;
}
module.exports = {
  PreferenceController: { createOne, updateOne, removeOne, getAll, removeAll, getOne, checkPreference, preferenceRestrictedTypeMail }
};
