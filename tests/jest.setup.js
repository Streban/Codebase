require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose')
const testDB = process.env.TEST_DB || 'mongodb://localhost:27017/plexaar_email_test_lab';

beforeAll(async () => {
  // DB Connection
  await mongoose.connect(testDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(database => console.log("DATABASE CONNECTED"));
});


afterAll(async () => {
  // Clear database after each test. Be cautious with this in a real environment.
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  await mongoose.disconnect();
});