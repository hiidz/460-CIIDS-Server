const tokenService = require("./token-service");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

const notifService = {};

notifService.registerPushToken = async (req, res) => {
  try {
    const lockid = String(req.body.lockid);
    const token = String(req.body.token);
    await tokenService.saveToken(lockid, token);
    res.status(200).send("success");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ msg: "Fail to send request", errors: ["Server error"] });
  }
};

notifService.pushNotification = async (lockid) => {
  console.log("PUSH NOTIFICATION ACTIVATED")
  const token = await tokenService.getToken(lockid);
  try {
    expo.sendPushNotificationsAsync([
      {
        to: token,
        title: "INTRUDER ALERT",
        body: "CIIDS Door security has been bypassed... Siren has activated, please check on your house. If this is an error, please disable the siren",
      },
    ]);
  } catch (err) {
    console.log(err);
  }
};

module.exports = notifService;
