const router = require("express").Router();
const _ = require("lodash");
const { ObjectId } = require("mongodb");
const campaignService = require("../../apis/controller/campaign.controller");
const campaignAnalyticsController = require("../../apis/controller/campaignAnalytics.controller");
const { scheduleCampaign } = require("../../utils/campaignCron");
const createSuccessResponse = require("../../utils/createSuccessResponse");

const createCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    await campaignAnalyticsController.createAnalytics({campaign:campaign.id});
    res.status(201).json(createSuccessResponse({message:'Campaign Created Successfully', data: campaign, }));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const filter = _.pick(req.query, ["_id", "name", "typeId", "status"]);
    const options = _.pick(req.query, ["sort", "page", "limit","populate"]);
    if (filter._id) filter._id = new ObjectId(filter._id);
    const campaigns = await campaignService.getAllCampaigns(filter, options);
    res.status(201).json(createSuccessResponse({message:'Campaign Fetched', data: campaigns }));

  } catch (error) {
    return res.status(404).json(createSuccessResponse({ message: error.message, error: true }));
  }
};

const getCampaignById = async (req, res) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json(createSuccessResponse({ message: "Campaign not found", error: true }));
    }
    res.status(200).json(campaign);
  } catch (error) {
    return res.status(400).json(createSuccessResponse({ message: error.message, error: true }));
  }
};

const updateCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.updateCampaign(
      req.params.id,
      req.body
    );
    res.status(200).json(createSuccessResponse({message:'Campaign Updated Successfully', data: campaign, }));

  } catch (error) {
    return res.status(400).json(createSuccessResponse({ message: error.message, error: true }));
  }
};

const deleteCampaign = async (req, res) => {
  try {
    await campaignService.deleteCampaign(req.params.id);
    res.status(200).send(createSuccessResponse({ message:'Campaign Deleted Successfully'}));
  } catch (error) {
    return res.status(400).json(createSuccessResponse({ message: error.message, error: true }));
  }
};

const executeCampaign = async (req, res) => {
  try {
    const campaignMsg = await campaignService.executeCampaign(req.body.campaign);
    res.status(200).json(createSuccessResponse({ message: campaignMsg }));
  } catch (error) {
    res.status(400).json(createSuccessResponse({ error:true, message: error.message, data:error }));
  }
};

router.route("/").post(createCampaign).get(getAllCampaigns);
router.route("/execute").post(executeCampaign);
router
  .route("/:id")
  .put(updateCampaign)
  .delete(deleteCampaign)
  .get(getCampaignById);

module.exports = router;
