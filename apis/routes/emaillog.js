const router = require("express").Router();

const { DEFAULT_PAGE_LIMIT } = require("../../constants");
const emailLog = require("../models/emaillog");

const _ = require('lodash')

router.route("/").post(createOne);
router.route("/").get(getAll);
router.route("/search").get(searchEmail);

function createOne(req, res, next) { }

async function getAll(req, res, next) {
  try {
    const filter = _.pick(req.query, ['status', 'type', 'emails', '_id', 'shortCode', 'businessId']);
    const options = _.pick(req.query, ['sort', 'page', 'limit']);

    if (filter._id) filter._id = new mongoose.Types.ObjectId(filter._id);

    const docs = await emailLog.paginate(filter, options);
    res.json({ data: docs });
  } catch (err) {
    next(err);
  }
}



async function searchEmail(req, res, next) {
  try {
    let { search, page } = req.query;
    let regex = new RegExp(search, "i");
    let options = {
      page: Number(page),
      limit: DEFAULT_PAGE_LIMIT,
      projection: "emails"
    };

    const result = await emailLog.paginate({ emails: { $regex: regex } }, options);

    let docs = result.docs;
    result.docs = undefined;

    res.json({ data: docs, ...result });
  } catch (err) {
    next(err);
  }
}


// function searchEmail(req, res, next) {
//   let { search, page } = req.query;
//   let regex = new RegExp(search, "i");
//   let options = { page: Number(page), limit: DEFAULT_PAGE_LIMIT, projection: "emails" };
//   emailLog.paginate({ emails: { $in: regex } }, options, (err, result) => {
//     if (err) {
//       return next(err);
//     }
//     let docs = result.docs;
//     delete result.docs;
//     return res.json({ data: docs, ...result });
//   });
// }

module.exports = router;
