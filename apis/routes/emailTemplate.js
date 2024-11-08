const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')


const EmailTemplateController = require("../controller/emailTemplate.controller");

router.route("/").post(createOne);
router.route("/").get(getAll);
router.route("/:ID").put(updateOne).delete(removeOne);



function createOne(req, res, next) {
  const { fields, template, title, shortCode, type, businessId } = req.body;

  EmailTemplateController.createOne({ fields, template, title, shortCode, type, businessId })
    .then((doc) => {
      return res.json({ data: doc });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}

function getAll(req, res, next) {
  const filter = _.pick(req.query, ['businessId', 'shortCode', 'title', 'type', '_id']);
  const options = _.pick(req.query, ['sort', 'page', 'limit']);
  if (filter._id) filter._id = new ObjectId(filter._id);

  EmailTemplateController.getAll(filter, options)
    .then((docs) => {

      return res.json({ data: docs });
    })
    .catch((err) => {
      console.log("------------template get all errror--------------", err)
      next(err)
    });
}

function removeOne(req, res, next) {
  EmailTemplateController.removeOne(req.params.ID)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Template not found against id",
        });
      }
      res.json({
        data: doc,
        message: "Email Template deleted successfully.",
      });
    })
    .catch((err) => next(err));
}

function updateOne(req, res, next) {
  return new Promise((resolve, reject) => {
    EmailTemplateController.updateOne(req.params.ID, req.body)
      .then((doc) => {
        res.json({
          data: doc,
          message: "Email Template updated successfully.",
        });
      })
      .catch((err) => next(err));
  });
}

module.exports = router;
