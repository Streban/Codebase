const cron = require("node-cron");
const Campaign = require("../apis/models/campaign.model");
const {
  executeCampaign,
  getCampaignDetails,
} = require("../apis/controller/campaign.controller");
const { isoToCron, getCronExpression } = require("./isoToCron");
const { sendEmailCampaign } = require("./sendCampaign");

let scheduledJobs = {};

// Example: Fetch campaign from database with a scheduled time
// This function should retrieve the campaign's time from the database
const getCampaignTime = async (campaignId) => {
  const campaign = await Campaign.findById(campaignId);
  // For example, let's assume the time is in 'HH:mm' format.
  return campaign.startDate; // Example time in cron format (2:15 PM every day)
};

// Set up cron job when campaign is scheduled
const scheduleCronJob = async (campaign) => {
  let { startTime: startDate } = campaign;
  if (!startDate) {
    startDate = await getCampaignTime(campaign._id);
  }

  const crontime = isoToCron(startDate);
  // Schedule the cron job
  cron.schedule(crontime, () => {
    executeCampaign(campaign._id);
  });
};

// Function to schedule a job dynamically
// function scheduleCampaign(campaignInDetail, recipients, parsedTemplate) {
//   try{
//   const { _id, startDate, endDate, interval, intervalType, isRecurring } =
//     campaignInDetail;

//   // Cancel any existing job with the same id
//   if (scheduledJobs[_id]) {
//     scheduledJobs[_id].stop();
//   }

//   if (!isRecurring) {
//     // One-time job
//     const date = new Date(endDate);
//     const timeout = date.getTime() - Date.now();
//     if (timeout < 0) throw new Error("Campaign Timeout");
//     if (timeout > 0) {
//         const cronTime = isoToCron(startDate);
//         console.log("Cron Time: ", cronTime);
//         scheduledJobs[_id] = cron.schedule(cronTime, ()=>{
//           let firstRun
//           if(startDate.getTime() < Date.now() ){
//             sendEmailCampaign({
//                 mailList: recipients.map((recipient) => recipient.email),
//                 subject: campaignInDetail.template.title,
//                 shortCode: campaignInDetail.template.shortCode,
//                 template: parsedTemplate,
//                 businessId: campaignInDetail.businessId,
//                 campaign: _id
//               })
//           }else if(campaign)

//             scheduledJobs[_id].stop();
//             scheduledJobs[_id].destroy();
//         },{
//           scheduled: true,
//           timezone: "Etc/UTC"  // Specify UTC time zone
//         })
//     }
//   } else {
//     // Recurring job
//     const cronExpression = getCronExpression(interval, intervalType);
//     console.log("cronExpression: ",cronExpression);
//     if (cronExpression) {
//       scheduledJobs[_id] = cron.schedule(cronExpression, () => {
//         console.log(Date.now(),"<<<Difference>>>" ,new Date(campaignInDetail.endDate).getTime())
//         if(Date.now() > new Date(campaignInDetail.endDate).getTime()){
//             scheduledJobs[_id].stop()
//             scheduledJobs[_id].destroy();
//         }else{
//             sendEmailCampaign({
//                 mailList: recipients.map((recipient) => recipient.email),
//                 subject: campaignInDetail.template.title,
//                 shortCode: campaignInDetail.template.shortCode,
//                 template: parsedTemplate,
//                 businessId: campaignInDetail.businessId,
//                 campaign: _id
//               })
//         }
//       });

//     }
//   }
//   return 'Cron Executed Successfully';
// }catch(err){
//   console.log(err);
//   return err;
// }
// }

async function scheduleCampaign(campaignInDetails) {
  const {
    getCampaignDetails,
  } = require("../apis/controller/campaign.controller");

  try {
    let { campaignInDetail, recipients, parsedTemplate, businessId } =
      campaignInDetails;
    let {
      _id,
      startDate,
      endDate,
      interval,
      intervalType,
      isRecurring,
      isOneTime
    } = campaignInDetail;
    // Cancel any existing job with the same id
    if (scheduledJobs[_id]) {
      scheduledJobs[_id].stop();
    }

    const now = Date.now();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // If the campaign has already ended, return an error
    if (now > end) {
      throw new Error("Campaign Time has already ended");
    }

    const sendEmail =async () => {
      try {
        if (!isOneTime) {
          const {
            recipients: _recepient,
            parsedTemplate: _parsedTemplate,
            campaignInDetail : _getCampaignDetail,
          } = await getCampaignDetails(campaignInDetail._id);
          recipients = _recepient;
          parsedTemplate = _parsedTemplate;
          campaignInDetail = _getCampaignDetail;
        }
        console.log(parsedTemplate,"<<<<<<<<<<<<");
        sendEmailCampaign({
          mailList: recipients.map((recipient) => recipient.email),
          subject: campaignInDetail.template.title,
          shortCode: campaignInDetail.template.shortCode,
          template: parsedTemplate,
          businessId: businessId,
          campaign: _id,
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (campaignInDetail.isOneTime) {
      sendEmail()
    } else if (!isRecurring) {
      // One-time job
      if (now < start) {
        // If the start time is in the future, schedule it at the start date
        const cronTime = isoToCron(startDate);
        console.log("Cron Time: ", cronTime);
        scheduledJobs[_id] = cron.schedule(
          cronTime,
          async () => {
            console.log("---------CRON------START-------SCHEDULE-----------");
            sendEmail();
            scheduledJobs[_id].stop();
          },
          {
            scheduled: true,
            timezone: "Etc/UTC",
          }
        );
      } else {
        // If the start time has passed but the end time has not
        throw new Error("Campaign Timed Out");
      }
    } else {
      // Recurring job with a first run at startDate
      const cronExpression = getCronExpression(interval, intervalType);
      console.log("cronExpression: ", cronExpression);

      if (now < start) {
        // First run scheduled for the future `startDate`
        const firstRunCron = isoToCron(startDate);
        scheduledJobs[_id] = cron.schedule(
          firstRunCron,
          async () => {
            try {
              console.log(
                "---------CRON------START-------RECURSIVE------FIRST-------"
              );
              sendEmail();
              // Schedule recurring job after first run
              if (cronExpression) {
                scheduledJobs[_id] = cron.schedule(
                  cronExpression,
                  async () => {
                    console.log(
                      "---------CRON------START-------RECURSIVE-----EXPRESSION--------"
                    );
                    if (Date.now() > end) {
                      scheduledJobs[_id].stop();
                    } else {
                      sendEmail();
                    }
                  },
                  {
                    scheduled: true,
                    timezone: "Etc/UTC",
                  }
                );
              }
            } catch (err) {
              console.log(err);
            }
          },
          {
            scheduled: true,
            timezone: "Etc/UTC",
          }
        );
      } else {
        // If the start time has already passed, send the first email now and start the interval afterwards
        sendEmail();
        if (cronExpression) {
          scheduledJobs[_id] = cron.schedule(
            cronExpression,
            async () => {
              console.log(
                "---------CRON------START-------RECURSIVE-----EXPRESSION--------"
              );
              if (Date.now() > end) {
                scheduledJobs[_id].stop();
              } else {
                sendEmail();
              }
            },
            {
              scheduled: true,
              timezone: "Etc/UTC",
            }
          );
        }
      }
    }

    console.log("Campaign Executed Successfully", _id);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

module.exports = {
  scheduleCronJob,
  scheduleCampaign,
};
