const router = require("express").Router();
const createSuccessResponse = require("../../utils/createSuccessResponse");
const analyticsService = require('../controller/campaignAnalytics.controller');

const createAnalytics = async (req, res) => {
    try {
        const analytics = await analyticsService.createAnalytics(req.body);
        res.status(201).json(createSuccessResponse({message:'Analytics Created Successfully',data:analytics}));
    } catch (error) {
        res.status(400).json(createSuccessResponse({ error: true, message: error.message }));
    }
};



const getAnalyticsById = async (req, res) => {
    try {
        const analytics = await analyticsService.getAnalyticsById(req.params.id);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getAnalyticsByCampaignId = async (req, res) => {
    try {
        const campaign = req.query.campaign
        const analytics = await analyticsService.getAnalyticsByCampignId(campaign);
        res.status(200).json(analytics);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const incrementAnalyticsFields = async (req, res) => {
    try {
        // if(campaign){
        //     switch (count ){
        //         case 'open':
        //             await analyticsService.incrementAnalytics(campaign, 'opened');
        //             break;
        //         case 'click':
        //             await analyticsService.incrementAnalytics(campaign, 'clicked');
        //             break;
        //         case 'revenue':
        //             await analyticsService.incrementAnalytics(campaign, 'revenue');
        //             break;
        //         case 'bounce':
        //             await analyticsService.incrementAnalytics(campaign, 'bounce');
        //             break;
        //         case 'subscribe':
        //             await analyticsService.incrementAnalytics(campaign, 'subscribe');
        //             break;
        //         case 'unsubscribe':
        //             await analyticsService.incrementAnalytics(campaign, 'unsubscribes');
        //             break;
        //         default:
        //             throw new Error('Invalid count parameter');
        //     }
            
        // }else{
            
            const { campaign, ...fieldsToUpdate } = req.query;
            console.log(req.query);
            const updatedAnalytics = await analyticsService.incrementAnalytics(campaign, fieldsToUpdate);
            res.status(200).json(updatedAnalytics);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteAnalytics = async (req, res) => {
    try {
        await analyticsService.deleteAnalytics(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

router.route("/").post(createAnalytics)
router.route("/campaignIncrement").get(incrementAnalyticsFields)
router.route("/campaignId").get(getAnalyticsByCampaignId)
router.route("/:id").delete(deleteAnalytics).get(getAnalyticsById)

module.exports = router;