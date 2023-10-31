const mongoose = require("mongoose");

const LockSchema = new mongoose.Schema({
  lock_id: {
    type: String,
  },
  acl: [{type: Object}], // access control list
  isSystemEnabled: {
    type: Boolean,
  }
});

module.exports = mongoose.model("locks", LockSchema);
