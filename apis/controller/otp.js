const OTP = require("../models/otp");


const generateRandomOTP = () => {
  return (
    new Date().getTime().toString().slice(-4) +
    "" +
    Math.floor(Math.random() * 9999999)
      .toString()
      .slice(-2)
  );
};

const generateAndSaveOTP = async (user) => {
  const _otp = generateRandomOTP();

  try {
    await OTP.create({ user, otpCode: _otp });
    return _otp;
  } catch (error) {
    throw error;
  }
};


function generateRandomNum() {
  let num = Math.random();
  return num;
}

async function verifyOtp(otp, user) {
  try {
    const doc = await OTP.findOneAndUpdate(
      { user, otpCode: otp, status: "pending" },
      { $set: { lastUpdatedAt: new Date(), status: "verified" } },
      { upsert: false, new: true }
    );

    return doc ? true : false;
  } catch (err) {
    throw err;
  }
}


module.exports = {
  verifyOtp,
  generateAndSaveOTP,
};
