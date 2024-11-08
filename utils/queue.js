
const Queue = require('bull');
const emailQueue = new Queue('email', 'redis://127.0.0.1:6379');



emailQueue.empty()
  .then(() => {
    console.log('------------------Cleared All jobs from EmailQueue-------------------');
  })
  .catch(error => {
    console.error('Error clearing completed jobs:', error);
  });
// emailQueue.process(async (job) => {
//   console.log(`Sending email to ${job.data.to}`);
// });



module.exports = emailQueue;