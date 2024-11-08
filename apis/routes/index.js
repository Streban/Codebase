const router = require("express").Router();
const emailTemplatesRoutes = require("./emailTemplate");
const otpRoutes = require("./otp");
const credRoutes = require("./credentials");
const emailLogs = require("./emaillog");
const fieldRoutes = require("./fields.js");
const businessRoutes = require("./business.route.js");
const tableAdminPreferenceRoutes = require("./tableAdminPreference.route.js");
const tableUserPreferenceRoutes = require("./tableUserPreference.route.js");
const campaignTypeRoutes = require("./campaignType.route.js");
const campaignLogsRoutes = require("./campaignLogs.route.js");
const segmentRoutes = require("./segment.route.js");
const campaignSegmentRoutes = require("./campaignSegment.route.js");
const campaignRoutes = require("./campaign.route.js");
const campaignAnalyticRoutes = require("./campaignAnalytics.route.js");
const recipientRoutes = require("./recipient.route.js");
const segmentRecipientRoute = require("./segmentRecipient.route.js");
const actionRoute = require("./action.route.js");
const campaignActionRoute = require("./campaignAction.route.js");
const preferenceRoutes = require('./preference.route.js')

router.route("/health-check").get((req, res) => res.send("OK"));
router.use("/templates", emailTemplatesRoutes);
router.use("/credentials", credRoutes);
router.use("/otp", otpRoutes);
router.use("/logs", emailLogs)
router.use("/field", fieldRoutes);
router.use("/business", businessRoutes);
router.use("/preference", preferenceRoutes);
router.use("/preference-admin", tableAdminPreferenceRoutes);
router.use("/preference-user", tableUserPreferenceRoutes);
router.use("/campaign-type", campaignTypeRoutes);
router.use("/campaign-log", campaignLogsRoutes);
router.use("/segment", segmentRoutes);
router.use("/campaign-segment", campaignSegmentRoutes);
router.use("/campaign", campaignRoutes);
router.use("/campaign-analytics", campaignAnalyticRoutes);
router.use("/recipient", recipientRoutes);
router.use("/segment-recipient", segmentRecipientRoute);
router.use("/action", actionRoute);
router.use("/campaign-action", campaignActionRoute);


module.exports = router;
