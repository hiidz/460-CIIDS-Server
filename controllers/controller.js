const Lock = require("../models/Lock"); // Import your User model
const mqttHandler = require('../config/mqtt-handler');
const Message = require("../models/Message");

const controller = {};

controller.healthCheck = async(req,res) => {
  return res.status(200).json({health_check: "success"});
}

controller.getACLByLockId = async (req, res) => {
  const lockid = req.params.lockid;

  try {
    const data = await Lock.findOne({ lockid: lockid });
    if (!data) {
      return res.status(400).json({
        msg: "Fail to fetch acl",
        errors: ["Lock id does not exist"],
      });
    }

    console.log("Fetch acl successfully");
    res.status(200).json(data.acl);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Fail to fetch acl", errors: ["Server error"] });
  }
};

controller.addACLUserByLockId = async (req, res) => {
  const lockid = req.params.lockid;
  const newACLObj = req.body.acl;

  try {
    const lock = await Lock.findOne({ lockid: lockid });

    if (!lock) {
      return res.status(400).json({
        msg: "Fail to fetch acl",
        errors: ["Lock id does not exist"],
      });
    }

    lock.acl.push(newACLObj);

    await lock.save();

    res.status(201).json({ msg: "Request to add new ACL successful" });

    mqttHandler.publishNewAcl(
      lockid,
      lock.acl.map((obj) => obj.id)
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Fail to send request", errors: ["Server error"] });
  }
};

controller.deleteACLUserByLockId = async (req, res) => {
  const lockid = req.params.lockid;
  const name = req.params.name;

  try {
    const response = await Lock.findOneAndUpdate(
      { lockid: lockid },
      { $pull: { acl: { name: name } } }
    ).lean();

    res.status(200).json({ msg: "Request to delete new ACL successful" });

    mqttHandler.publishNewAcl(
      lockid,
      response.acl.filter((obj) => obj.name !== name).map((obj) => obj.id)
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Fail to send request", errors: ["Server error"] });
  }
};

controller.toggleSystemSecurity = async (req, res) => {
  const lockid = req.params.lockid;
  const isSystemEnabled = req.body.isSystemEnabled;
  try {
    const lock = await Lock.findOne({ lockid: lockid });

    if (!lock) {
      return res.status(404).json({
        msg: "Failed to update system status",
        errors: ["Lock id does not exist"],
      });
    }
    lock.isSystemEnabled = isSystemEnabled;
    await lock.save();

    console.log("system state is now: ", isSystemEnabled);
    res.status(200).json({
      msg: "Request to change system state successful",
      isSystemEnabled: isSystemEnabled,
    });

    mqttHandler.publishSystemState(lockid, isSystemEnabled);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Fail to send request", error: [err.Message] });
  }
};

controller.getSystemSecurity = async (req, res) => {
  const lockid = req.params.lockid;
  try {
    const lock = await Lock.findOne({ lockid: lockid });

    if (!lock) {
      return res.status(404).json({
        msg: "Failed to update system status",
        errors: ["Lock id does not exist"],
      });
    }
    console.log("system state fetched successfully");
    res.status(200).json(lock.isSystemEnabled);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Fail to send request", error: [err.Message] });
  }
};

controller.getLogs = async (req, res) => {
  const lockid = req.params.lockid;
  try {
    const log = await Message.find({ lockid: lockid });
    if (!log) {
      res.status(404).json({ msg: "Invalid lock id" });
    }
    res.status(200).json(log);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Failed to send request", errors: [err] });
  }
};

controller.disableSiren = async (req, res) => {
  const lockid = req.params.lockid;
  try {
    mqttHandler.publishDisableSiren(lockid);
    res.status(200).json({ msg: "Request to disable siren successful" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Fail to send request", errors: ["Server error"] });
  }
};

controller.registerToken = async (req, res) => {
  tokens.push(req.body.token);
  res.status(200).json({ message: "Successfully registered FCM Token!" });
};



module.exports = controller;
