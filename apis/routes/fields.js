const router = require("express").Router();

const { fieldcontroller } = require("../controller/field.controller");

router.route("/").post(createOne).get(getAll);
router.route("/:ID").put(updateOne).delete(removeOne);

async function createOne(req, res, next) {
  try {
    const doc = await fieldcontroller.createOne(req.body);
    res.json({ data: doc });
  } catch (err) {
    next(err);
  }
}


function getAll(req, res, next) {
  fieldcontroller.getAll(req.query.businessId ? { businessId: req.query.businessId } : {})
    .then((docs) => {
      res.json({ data: docs });
    })
    .catch((err) => next(err));
}

function updateOne(req, res) {
  fieldcontroller.updateOne(req.params.ID, req.body)
    .then((doc) => {
      res.json({ data: doc, message: "Updated successfully" });
    })
    .catch((err) => next(err));
}

function removeOne(req, res) {
  fieldcontroller.removeOne(req.params.ID)
    .then((doc) => {
      res.json({ message: "Removed successfully." });
    })
    .catch((err) => next(err));
}

module.exports = router;
