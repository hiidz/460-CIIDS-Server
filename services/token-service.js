const Lock = require("../models/Lock"); // Import your User model

const tokenService = {};

tokenService.saveToken = async (lockid, token) => {
  try {
    const lock = await Lock.findOne({ lockid: lockid });

    if (!lock) {
      console.log("lockid dont exist");
      throw {
        msg: "Fail to fetch acl",
        errors: ["Lock id does not exist"],
      };
    }
    lock.token = token;
    await lock.save();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

tokenService.getToken = async (lockid) => {
  try {
    const lock = await Lock.findOne({ lockid: lockid });
    console.log(lock.token);
    if (!lock) {
      return res.status(400).json({
        msg: "Fail to fetch acl",
        errors: ["Lock id does not exist"],
      });
    }

    return lock.token;
  } catch {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Fail to send request", errors: ["Server error"] });
  }
};

module.exports = tokenService;
