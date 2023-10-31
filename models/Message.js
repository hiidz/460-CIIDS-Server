const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  lockid: {
    type: String,
  },
  message_id: {
    type: String,
  },
  message: [{type: String}],
  timestamp: [{type: String}]
});

module.exports = mongoose.model("messages", MessageSchema);