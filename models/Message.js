const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message_id: {
    type: String,
  },
  lock_id: {
    type: String,
  },
  message: [{type: String}],
  timestamp: [{type: String}]
});

module.exports = mongoose.model("messages", MessageSchema);