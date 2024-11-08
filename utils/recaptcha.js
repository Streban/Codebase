const axios = require("axios");
const config = require("../config");
const { ApiError } = require("./error");

const recaptcha = async (req, res, next) => {
  try {
    const platform = req.body.platform || 'plexaar'
    const recaptchaToken = req.body?.recaptchaToken;
    if (recaptchaToken) {
      // Setting Web Captcha key for plexaar or buzzcom
      let webPlatformKey
      switch(platform){
        case "buzzcom":
          webPlatformKey = config.recaptcha.buzzcomWebCaptchaKey;
          break;
        default:
          webPlatformKey = config.recaptcha.webCaptchaKey;
      }
      console.log("PLATFORM",platform," >> ", webPlatformKey);
      let crossPlatformSecretKey = config.recaptcha.crossPlatformSecretKey;
      // Set the related key into secretKey
      const secretKey = req.body?.crossplatform ? crossPlatformSecretKey : webPlatformKey;
      
      if (req.body?.requestedBy) {
        const recaptchaKey =
          req.body?.requestedBy.toLowerCase() === "ios"
            ? config.recaptcha.iosFrontEndSiteKeys
            : config.recaptcha.androidFrontEndSiteKeys;
        const apiKey =   req.body?.requestedBy.toLowerCase() === "ios"
                          ? config.recaptcha.iosSiteKeys 
                          : config.recaptcha.androidSiteKeys;
        const result = await assessMobileCaptcha(recaptchaKey, recaptchaToken, apiKey);
        if (result.isSuccess) {
          req.recaptchaVerified = true;
          next();
          return;
        } else {
          req.recaptchaVerified = false;
          next();
          return;
        }
      }
      console.log("SECRET KEY SIMPLE???",secretKey)
      const response = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        null,
        {
          params: {
            secret: secretKey,
            response: recaptchaToken,
          },
        }
      );
      console.log("reCAPTCHA Response >>>>>", response.data);
      const { success, score } = response.data;
      if (success && score > 0.5 ) {
        // CAPTCHA verification succeeded, proceed with your logic
        req.recaptchaVerified = true;
        next();
      } else {
        // CAPTCHA verification failed
        // req.recaptchaVerified = false
        // next()
        throw new ApiError(400,'RECAPTCHA NOT VERIFIED');
      }
    } else {
      next();
    }
  } catch (err) {
    console.error("reCAPTCHA verification error: ", err);
    next(err);
  }
};

async function assessMobileCaptcha(recaptchaSiteKey, token, apiKey) {
  const projectID = config.recaptcha.projectId;
  const recaptchaAction = "LOGIN";
  
  let model = {
    isSuccess: true,
    error: "Success",
  };
    if (!token) {
      throw new Error("Empty or null token provided");
    }
    console.log("TOKEN_TYPE", typeof token)

    const request = {
      event: {
        token: token,
        siteKey: recaptchaSiteKey,
        expectedAction: recaptchaAction,
      },
    };

   
      const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectID}/assessments?key=${apiKey}`;
      const recaptchaResponse = await axios.post(url, request, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const googleReCaptchaResponse = recaptchaResponse.data;
      console.log("googleReCaptchaResponse>>>>", googleReCaptchaResponse);
      if (!googleReCaptchaResponse.tokenProperties.valid) {
        throw new ApiError(400, `RECAPTCHA_TOKEN IS NOT VALID.`);
      }
      if (
        googleReCaptchaResponse.tokenProperties.action.toLowerCase() !==
        recaptchaAction.toLowerCase()
      ) {
        throw new ApiError(400, `RECAPTCHA INVALID ACTION`);
      }
      if (googleReCaptchaResponse.riskAnalysis.score < 0.5) {
        throw new ApiError(400, `RECAPTCHA LOW SCORE`);
      }
     
  return model;
}

module.exports = {
  recaptcha,
  assessMobileCaptcha,
};
