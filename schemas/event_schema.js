const mongoose = require("mongoose");

const add_event_schema = new mongoose.Schema(
  {
    event_id: { type: String, require: true, unique: true },
    guild_id: { type: String, require: true, unique: false },
    channel_id: { type: String, require: true, unique: false },
    owner_id: { type: String, require: true, unique: false },
    event_name: { type: String, require: true, unique: false },
    event_status: { type: String, require: true, unique: false },
    last_time: { type: String, require: true, unique: false },
  },
  {
    versionKey: false,
  }
);

const model = mongoose.model("event", add_event_schema);

module.exports = model;
