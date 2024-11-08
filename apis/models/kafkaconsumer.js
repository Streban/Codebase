const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const consumerPayloadSchema = new Schema(
  {
    topic: { type: String, required: true },
    event: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
    eventId: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "kafka_consumer_payload",
  consumerPayloadSchema
);
