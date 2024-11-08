const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const tableAdminPreferenceController = require("../controller/tableAdminPreference.controller");

router.route("/").post(createAdminPreference);
router.route("/").get(getAll);
router.route("/:ID").put(updateOne).delete(removeOne);

async function createAdminPreference(req, res, next) {
  try {
    const doc = await tableAdminPreferenceController.createAdminPreference(req.body);
    return res.json({ data: doc });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

function getAll(req, res, next) {
  const filter = _.pick(req.query, ['table_name', 'columnId', 'sticky', '_id', 'isShow']);
  const options = _.pick(req.query, ['sort', 'page', 'limit']);
  if (filter._id) filter._id = new ObjectId(filter._id);

  tableAdminPreferenceController.getAll(filter, options)
    .then((docs) => {
      return res.json({ data: docs });
    })
    .catch((err) => next(err));
}

function removeOne(req, res, next) {
  tableAdminPreferenceController.removeOne(req.params.ID)
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
async function updateOne(req, res, next) {
  try {
    const doc = await tableAdminPreferenceController.updateOne(req.params.ID, req.body);
    res.json({
      data: doc,
      message: "Preference updated successfully.",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
