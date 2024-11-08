const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const { validateCredentials, createCredentialsSchema, updateCredentialsSchema } = require("../../middlewares/validations");
const { CredentailsController } = require("../controller/cred.controller");
const CredentialsModal = require("../models/credentials.model");

router.route("/").post(validateCredentials(createCredentialsSchema), createOne).get(getAll);
router.route("/:ID").put(validateCredentials(updateCredentialsSchema), updateOne).delete(removeOne);

function createOne(req, res, next) {

  CredentailsController.createOne(req.body)
    .then((result) => {
      res.json({ data: result });
    })
    .catch((err) => next(err));
}

async function getAll(req, res, next) {
  try {
    const filter = _.pick(req.query, ['country', 'businessId', 'type', '_id']);
    const options = _.pick(req.query, ['sort', 'page', 'limit', 'lean']);
    if (filter._id) filter._id = new ObjectId(filter._id);

    const docs = await CredentailsController.getAll(filter, options);
    console.log(docs, "(filter, options)")
    res.json({ data: docs });
  } catch (err) {
    next(err);
  }
}

async function updateOne(req, res) {
  try {
    const doc = await CredentailsController.updateOne(req.params.ID, req.body);
    res.json({ data: doc, message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
}

async function removeOne(req, res, next) {
  try {
    await CredentailsController.removeOne(req.params.ID);
    res.json({ message: "Removed successfully." });
  } catch (err) {
    next(err);
  }
}


module.exports = router;
