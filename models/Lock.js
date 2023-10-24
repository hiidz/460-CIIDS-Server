const mongoose = require("mongoose");

const LockSchema = new mongoose.Schema({
  lock_id: {
    type: String,
  },
  acl: [{type: Object}]
});

module.exports = mongoose.model("locks", LockSchema);
