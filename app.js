const express = require("express");
const bodyParser = require("body-parser");

const { handleNotFound, handleError } = require("./utils/error");
const { setupMorganLoggar } = require("./middlewares/morgan-logger");
let allRoutes = require("./apis/routes");
const router = express.Router();

const app = express();

setupMiddleWares(app);
setupRoutes(allRoutes);

// UnCaughtException Handling
process.on('unhandledRejection', (err) => {
    // Handle the error here, e.g., log the error or take some other action
    console.error('Unhandled Promise Rejection:', err);

    // Optionally, you can also prevent the process from shutting down
    // by calling `process.exit(1)` or any other appropriate cleanup.
    // process.exit(1);
});


app.use(handleError);
app.use(handleNotFound);

function setupMiddleWares(_app) {
    _app.use(bodyParser.json({ limit: '50mb' }));
    _app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    _app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token, authorization, Authorization, *");
        res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, Authorization, authorization");
        next();
    });
    setupMorganLoggar(_app);
}


function setupRoutes(_routes) {
    app.use(router);
    app.use("/email_svc/pb", _routes);
}


module.exports = app