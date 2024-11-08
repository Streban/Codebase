const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const tableUserPreferenceController = require("../controller/tableUserPreference");

router.route("/").post(createUserPreference);
router.route("/").get(getAll);
router.route("/:ID").put(updateOne).delete(removeOne);

function createUserPreference(req, res, next) {

  tableUserPreferenceController.createUserPreference(req.body)
    .then((doc) => {
      return res.json({ data: doc });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}

function getAll(req, res, next) {
  const filter = _.pick(req.query, ['table_name', 'columnId', 'sticky', '_id', 'isShow']);
  const options = _.pick(req.query, ['sort', 'page', 'limit']);
  if (filter._id) filter._id = new ObjectId(filter._id);

  console.log("========================", options);
  tableUserPreferenceController.getAll(filter, options)
    .then((docs) => {
      return res.json({ data: docs });
    })
    .catch((err) => next(err));
}

function removeOne(req, res, next) {
  tableUserPreferenceController.removeOne(req.params.ID)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Preference not found against id",
        });
      }
      res.json({
        data: doc,
        message: "Preference deleted successfully.",
      });
    })
    .catch((err) => next(err));
}

function updateOne(req, res, next) {
  return new Promise((resolve, reject) => {
    tableUserPreferenceController.updateOne(req.params.ID, req.body)
      .then((doc) => {
        res.json({
          data: doc,
          message: "Preference updated successfully.",
        });
      })
      .catch((err) => next(err));
  });
}

module.exports = router;
