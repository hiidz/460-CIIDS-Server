require('dotenv').config();
const mqtt = require("mqtt");
const mqttService = {};
const Lock = require("../models/Lock");
const notifService = require("../services/notif-service");


const Message = require("../models/Message");

// Define HiveMQ credentials
const mqttUsername = process.env.mqttUsername;
const mqttPassword = process.env.mqttPassword;
const mqttURL = process.env.mqttURL;

const client = mqtt.connect(mqttURL, {
  username: mqttUsername,
  password: mqttPassword,
});

// Ensure MQTT Broker connected
client.on("connect", () => {
  console.log("MQTT Connected!");
});

client.on("message", async function (topic, message) {
  console.log(topic, "\n", message.toString());

  if (topic.split("/")[0] === "logs") {
    saveLogs(message.toString(), topic.split("/")[1]);
  }

  if (topic.split("/")[0] === "siren") {
    activateSiren(topic.split("/")[1]);
  }
});

// prints an error message
client.on("error", (error) => {
  console.log("Error:", error);
});

mqttService.publishNewAcl = async (lockid, aclList) => {
  client.publish(`acl/${lockid}`, JSON.stringify(aclList), { qos: 2 });
};

mqttService.publishDisableSiren = async (lockid) => {
  console.log(lockid);
  client.publish(`deactivate_alert/${lockid}`, "disable_siren", { qos: 2 });
};

mqttService.publishSystemState = async (lockid, isSystemEnabled) => {
  client.publish(
    `toggle_system/${lockid}`,
    isSystemEnabled ? "enable_system" : "disable_system", { qos: 2 }
  );
};

mqttService.logSubscriber = async () => {
  client.subscribe(`logs/#`, {qos: 2});
};

mqttService.sirenSubscriber = async () => {
  client.subscribe(`siren/#`, {qos: 2});
};

saveLogs = async (logMessage, lockid) => {
  try {
    const log = new Message({
      lockid: lockid,
      message: logMessage,
    });

    await log.save();
  } catch (err) {
    console.log(err);
  }
};

activateSiren = async (lockid) => {
  try {
    const data = await Lock.findOne({ lockid: lockid });
    if (!data) {
      console.log("lockid:", lockid, "dont exist");
      return;
    }

    notifService.pushNotification(lockid);

  } catch (err) {
    console.log(err);
  }
};

module.exports = mqttService;
