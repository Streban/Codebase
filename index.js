
const app = require('./app')

const config = require("./config");

const console = require("./utils/log");


const { Credentails } = require("./apis/controller/cred.controller");

config.connectDB().then(() => {
  Credentails.init()
    .then(() => {
      console.log("-------- credentials initialized --------");
    })
    .catch((err) => console.log(err));
});

// UnCaughtException Handling
process.on('unhandledRejection', (err) => {
  // Handle the error here, e.g., log the error or take some other action
  console.error('Unhandled Promise Rejection:', err);

  // Optionally, you can also prevent the process from shutting down
  // by calling `process.exit(1)` or any other appropriate cleanup.
  // process.exit(1);
});


app.listen(config.port, () => console.success(`Email service listening on port ${config.port}`));

