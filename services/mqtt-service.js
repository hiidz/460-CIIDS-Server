const mqtt = require("mqtt");
const mqttService = {};

const Message = require("../models/Message");

// Define HiveMQ credentials
const mqttUsername = "cs460-ciids";
const mqttPassword = "cs460-ciids";
const mqttURL =
  "tls://8b75be343db54492af6d707435cdbdf5.s2.eu.hivemq.cloud:8883";

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
  client.publish(`acl/${lockid}`, JSON.stringify(aclList));
};

mqttService.publishDisableSiren = async (lockid) => {
  client.publish(`deactivate_alert/${lockid}`)
}

mqttService.logSubscriber = async () => {
  client.subscribe(`logs/#`);
};

mqttService.sirenSubscriber = async () => {
  client.subscribe(`siren/#`);
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
  // push notification to react native

  try {
    const data = await Lock.findOne({ lock_id: lockid });
    if (!data) {
      console.log("lockid:", lockid, "dont exist");
      return;
    }

    // push notification logic

  } catch (err) {
    console.log(err);
  }
};

module.exports = mqttService;
