const UserEmailSettingController = require("../controller/userEmailSetting.controller");

const router = require("express").Router();

router.route("/").post(createOne).get(getAll);
router.route("/:ID").put(updateOne).delete(removeOne);

function createOne(req, res, next) {
  const { user, email, setting } = req.body;
  UserEmailSettingController.createOne({ user, email, setting })
    .then((doc) => {
      res.json({ message: doc });
    })
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  UserEmailSettingController.getAll()
    .then((docs) => {
      res.json({ data: docs });
    })
    .catch((err) => next(err));
}

function updateOne(req, res, next) {
  UserEmailSettingController.updateOne(req.params.ID, req.body)
    .then((doc) => {
      res.json({ data: doc, message: "Template updated successfully" });
    })
    .catch((err) => next(err));
}

function removeOne(req, res, next) {
  UserEmailSettingController.removeOne(req.params.ID)
    .then((doc) => {
      res.json({ message: "Removed Successfully", data: doc });
    })
    .catch((err) => next(err));
}

module.exports = router;
