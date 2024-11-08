const router = require("express").Router();

const Model = require("../models/emaillog");
const OTPController = require("../controller/otp");
router.route("/verify").post(verify);

function verify(req, res, next) {
  const { otp, user } = req.body;
  OTPController.verifyOtp(otp, user)
    .then((doc) => {
      if (!doc) {
        return res.status(422).json({ message: "Otp verfiication failed", success: false, isVerfied: false });
      }

      return res.json({ message: "Verified successfully", success: true, isVerfied: true });
    })
    .catch((err) => next(err));
}

function getAll(req, res, next) {}

module.exports = router;
