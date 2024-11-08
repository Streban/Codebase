const router = require("express").Router();

const { TYPE } = require("../../constants");
const createSuccessResponse = require("../../utils/createSuccessResponse");
const { PreferenceController } = require("../controller/preference.controller");
const _ = require("lodash");

router.route("/").post(createOne).get(getAll);
router.route("/:ID").put(updateOne).delete(removeOne);

async function createOne(req, res, next) {
  if(!Object.values(TYPE).includes(req.body.type)){
    return res.status(400).json(createSuccessResponse({error:true, message:"Type Not Exist"}));
  }
  const preference = await PreferenceController.getOne({email:req.body.email, type:req.body.type, businessId:req.body.businessId})
  if(preference){
    return res.status(400).json(createSuccessResponse({error:true, data:preference, message:"Already Exist"}));
  }
  PreferenceController.createOne(req.body)
    .then((result) => {
      res.json(
        createSuccessResponse({ message: "Created Successful", data: result })
      );
    })
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  const filter = _.pick(req.query, [
    "type",
    "email",
    "userId",
    "_id",
    "shortCode",
    "restricted",
    "businessId"
  ]);
  const options = _.pick(req.query, ["sort", "page", "limit", "lean"]);
  PreferenceController.getAll(filter,options)
    .then((docs) => {
      res.json(createSuccessResponse({ message: "Data Fetched", data: docs }));
    })
    .catch((err) => next(err));
}

function updateOne(req, res, next) {
  PreferenceController.updateOne(req.params.ID, req.body)
    .then((doc) => {
      if (!doc) {
        return res.json(
          createSuccessResponse({ error: true, message: "Data Not Exist" })
        );
      }
      res.json(
        createSuccessResponse({ data: doc, message: "Updated successfully" })
      );
    })
    .catch((err) => next(err));
}

function removeOne(req, res, next) {
  PreferenceController.removeOne(req.params.ID)
    .then((doc) => {
      if (!doc) {
        return res.json(
          createSuccessResponse({ error: true, message: "Field Not Exist" })
        );
      }
      res.json(createSuccessResponse({ message: "Removed successful" }));
    })
    .catch((err) => next(err));
}

module.exports = router;
