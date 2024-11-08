const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require('dotenv').config()

const console = require("../utils/log");
const mongoDB = process.env.MONGO_DB || "emailSvc";
const mongoUrl = process.env.mongoUrl;
const port = process.env.PORT | 8000;
const Link = process.env.LINK ||  'https://expert-staging.expert.one/'

const connectDB = () => {
  console.info("url", mongoUrl);
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoUrl //+ `/${mongoDB}`,
       ,(err) => {
      if (err) {
        return reject(err);
      }
      console.success("Db connected successfully.");
      return resolve(true);
    });
  });
};

const admin ={
  apiKey : process.env.PRIVATEAPIKEYUUID
}


module.exports = {
  port,
  connectDB,
  Link,
  admin
};
