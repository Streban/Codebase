const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const BusinessController = require("../controller/business.controller");
const createSuccessResponse = require("../../utils/createSuccessResponse");

router.route("/").post(createOne).get(getAll);
router.route("/:ID").put(updateOne).delete(removeOne);


async function createOne(req, res, next) {
  try {
    const doc = await BusinessController.createOne(req.body);
    return res.status(201).json(createSuccessResponse({ message:'Business Created Successfully',data: doc }));
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const filter = _.pick(req.query, ['businessId', '_id', 'name']);
    const options = _.pick(req.query, ['sort', 'page', 'limit']);
    if (filter._id) filter._id = new ObjectId(filter._id);

    const docs = await BusinessController.getAll(filter, options);
    return res.status(200).json(createSuccessResponse({ message:'Business Fetched Successfully', data: docs }));
  } catch (err) {
    next(err);
  }
}


function removeOne(req, res, next) {
  BusinessController.removeOne(req.params.ID)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json(createSuccessResponse({
          error: true,
          message: "business not found against id",
        }));
      }
      res.status(200).json(createSuccessResponse({
        message: "Email business deleted successfully.",
        data: doc,
      }));
    })
    .catch((err) => next(err));
}

async function updateOne(req, res, next) {
  try {
    const doc = await BusinessController.updateOne(req.params.ID, req.body);
    res.json(createSuccessResponse({
      data: doc,
      message: "Email business updated successfully.",
    }));
  } catch (err) {
    next(err);
  }
}

module.exports = router;


