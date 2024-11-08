const brevo = require("@getbrevo/brevo");
let defaultClient = brevo.ApiClient.instance;

const emailLogger = require("../apis/controller/emaillog.controller");
const CampaignLog = require("../apis/controller/campaignLogs.controller");
const {
  getBusinessBalance,
  updateOne,
  updateBalance,
} = require("../apis/controller/business.controller");
const { CAMPAIGN_STATUSES: CAMPAIGN_ERRORS } = require("../constants");

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";
let apiInstance = new brevo.TransactionalEmailsApi();
let sendSmtpEmail = new brevo.SendSmtpEmail();

exports.sendEmailCampaign = async ({
  mailList,
  subject,
  shortCode,
  template,
  businessId,
  campaign,
}) => {
  console.log(template);
  const getBusiness = await getBusinessBalance(businessId);
  console.log("DEMO>>", shortCode, mailList);
  for (let i = 0; i < mailList.length; i++) {
    if (getBusiness.balance > getBusiness.perMessageRate || !campaign) {
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = template;
      sendSmtpEmail.sender = {
        name: "testexpert",
        email: "test@expertcentre.co.uk",
      };
      sendSmtpEmail.to = campaign
        ? JSON.parse(JSON.stringify([{ email: mailList[i] }]))
        : JSON.parse(JSON.stringify([mailList[i]]));

      apiInstance
        .sendTransacEmail(sendSmtpEmail)
        .then(async function (data) {
          console.log(
            "API called successfully. Returned data: " + JSON.stringify(data)
          );
          data = JSON.parse(JSON.stringify(data));
          await updateBalance(
            { businessId: getBusiness.businessId },
            {
              $set: {
                balance: (
                  parseFloat(getBusiness.balance) - getBusiness.perMessageRate
                ).toString(),
              },
            }
          ).then("--- Balance Updated ---");
          if (campaign) {
            CampaignLog.createCampaignLog({
              businessId,
              campaign,
              email: mailList[i],
              status: "OK",
              type: CAMPAIGN_ERRORS.OK,
              messageId: data.messageId,
              timestamp: new Date(),
            });
          }
          emailLogger.createOne({
            emails: mailList[i].email,
            type: subject,
            shortCode,
            template,
            businessId,
            status: "OK",
            messageId: data.messageId,
          });
        })
        .catch(function (error) {
          console.error(error);
          if (campaign) {
            CampaignLog.createCampaignLog({
              campaign,
              email: mailList[i],
              status: "FAILED",
              messageId: null,
              timestamp: new Date(),
              type: CAMPAIGN_ERRORS.UNKNOWN,
            });
          }
          emailLogger.createOne({
            emails: mailList[i].email,
            type: subject,
            status: "FAILED",
            shortCode,
            template,
            businessId,
            messageId: "n/a",
            data: { message: error.message },
          });
        });
    } else {
      console.log("------------ INSUFFICIENT ---------------");
      CampaignLog.createCampaignLog({
        campaign,
        status: "FAILED",
        messageId: null,
        timestamp: new Date(),
        error: `Insufficient Balance for business-${businessId}`,
        type: CAMPAIGN_ERRORS.INSUFFICIENT_BALANCE,
      });
    }
  }
};
