const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  lockid: {
    type: String,
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("messages", MessageSchema);