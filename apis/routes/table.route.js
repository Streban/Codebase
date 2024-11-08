const router = require("express").Router();
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const TableController = require("../controller/table.controller");
const emailTemplate = require("../models/emailTemplate");

router.route("/").post(createOne);
router.route("/").get(getAll);
router.route("/:ID").put(updateOne).delete(removeOne);
router.route("/template-table").get(getTable)

async function getTable(req, res, next) {

  const table = await TableController.getTableByName(req.query)
  const templates = await emailTemplate.find()
  const modifiedTable = []
  if (table.length) {
    for (let indTable of table) {
      if (templates.length > 0) {
        indTable = indTable.toObject()
        indTable.column_values = templates.map(template => {
          let value = template[indTable.column_name]
          let templateId = template._id
          return {
            value,
            templateId
          }
        })
        modifiedTable.push(indTable);
      }
    }
  }

  res.status(200).send(modifiedTable);
}

async function createOne(req, res, next) {
  try {
    const doc = await TableController.createOne(req.body);
    res.json({ data: doc });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const filter = _.pick(req.query, ['table_name', 'column_no', 'sticky', '_id', 'isShow']);
    const options = _.pick(req.query, ['sort', 'page', 'limit']);
    if (filter._id) filter._id = new ObjectId(filter._id);

    const docs = await TableController.getAll(filter, options);
    res.json({ data: docs });
  } catch (err) {
    next(err);
  }
}

async function removeOne(req, res, next) {
  try {
    const doc = await TableController.removeOne(req.params.ID);
    if (!doc) {
      return res.status(404).json({
        message: "Table not found against id",
      });
    }
    res.json({
      data: doc,
      message: "Email Table deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}


async function updateOne(req, res, next) {
  try {
    const doc = await TableController.updateOne(req.params.ID, req.body);
    res.json({
      data: doc,
      message: "Email Table updated successfully.",
    });
  } catch (err) {
    next(err);
  }
}


module.exports = router;


