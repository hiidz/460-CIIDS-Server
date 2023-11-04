const mongoose = require("mongoose");

const LockSchema = new mongoose.Schema({
  lockid: {
    type: String,
  },
  acl: [{type: Object}], // access control list
  isSystemEnabled: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  }
});

module.exports = mongoose.model("locks", LockSchema);
