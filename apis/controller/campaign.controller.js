const { scheduleCampaign } = require("../../utils/campaignCron");
const { parseTemplate } = require("../../utils/parseTemplate");
const { sendEmailCampaign } = require("../../utils/sendCampaign");
const Campaign = require("../models/campaign.model");
const Recipient = require("../models/recipient.model");
const SegmentRecipient = require("../models/segmentRecipient.model");
const { getBusinessBalance } = require("./business.controller");

const createCampaign = async (data) => {
  return await Campaign.create(data);
};

const getAllCampaigns = async (filter, options) => {
  options.populate = ["typeId"];
  return await Campaign.paginate(filter, options);
};

const getCampaignById = async (id) => {
  return await Campaign.findById(id).populate("business", "typeId");
};

const campaignInDetail = async (campaign) => {
  return await Campaign.findById(campaign).populate("segment template").lean();
};

const updateCampaign = async (id, data) => {
  return await Campaign.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteCampaign = async (id) => {
  return await Campaign.findByIdAndDelete(id);
};

const getCampaignDetails = async (id) => {
  try {
    // console.log("Enter Details",id);

    const campaigndetail = await campaignInDetail(id);
    if (!campaigndetail) throw new Error("Campaign not found");
    const getBusiness = await getBusinessBalance(campaigndetail.businessId);
    if (getBusiness?.balance < getBusiness?.perMessageRate)
      throw new Error("Insufficient Balance to send least 1 message");
    // if(campaignInDetail.isExecuted){
    //   throw new Error('Campaign Already Executed')
    // }
    const segmentFilter = {};
    console.log(campaigndetail);
    campaigndetail.segment.filter.map(
      (obj) => (segmentFilter[obj.name] = obj.value)
    );

    // console.log(segmentFilter);

    const recipients = await Recipient.find(segmentFilter).lean();
    const parsedTemplate = parseTemplate(
      campaigndetail.template.template,
      campaigndetail.template.fields,
      {
        openLink: `${process.env.CAMPAIGNANALYTICSBASEURL}?campaign=${id}&opened=1`,
        clickLink: `${process.env.CAMPAIGNANALYTICSBASEURL}?campaign=${id}&clicked=1`,
      }
    );
    return {
      campaignInDetail: campaigndetail,
      recipients,
      parsedTemplate,
      totalMessages: recipients.length,
      totalCost: recipients.length * getBusiness.perMessageRate,
      businessId: campaigndetail.businessId,
    };
  } catch (e) {
    console.log(e);
    return new Error(e.message);
  }
};

const executeCampaign = async (campaign) => {
  try {
    const campaignInDetails = await getCampaignDetails(campaign);
    if (!campaignInDetails) throw new Error("Campaign not found");
    // const getBusiness = await getBusinessBalance(campaignInDetail.businessId);
    // if (getBusiness?.balance < getBusiness?.perMessageRate)
    //   throw new Error("Insufficient Balance to send least 1 message");
    // if(campaignInDetail.isExecuted){
    //   throw new Error('Campaign Already Executed')
    // }
    // const segmentFilter = {};
    // campaignInDetail.segment.filter.map((obj) => {
    //   if (obj.name === "age") {
    //     return (segmentFilter[obj.name] = obj.value);
    //   } else segmentFilter[obj.name] = obj.value;
    // });
    // console.log(segmentFilter);
    
    // const recipients = await Recipient.find(segmentFilter);
    // const parsedTemplate = parseTemplate(
    //   campaignInDetail.template.template,
    //   campaignInDetail.template.fields,
    //   {
    //     openLink: `${process.env.CAMPAIGNANALYTICSBASEURL}?campaign=${campaign}&opened=1`,
    //     clickLink: `${process.env.CAMPAIGNANALYTICSBASEURL}?campaign=${campaign}&clicked=1`,
    //   }
    // );
    
    scheduleCampaign(campaignInDetails);
    // campaignInDetail.isExecuted = true;
    await Campaign.findByIdAndUpdate(campaignInDetail._id, {
      $set: {
        lastExecutedTime: new Date().toISOString(),
        status: "active",
      },
    });
    return "campaign execution in-progress, please wait or check you logs...";
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignDetails,
  executeCampaign,
};
