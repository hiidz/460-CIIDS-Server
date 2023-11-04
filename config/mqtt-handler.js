require("dotenv").config();
const mqtt = require("mqtt");

class MqttHandler {
  constructor() {
    if (MqttHandler.instance) {
      return MqttHandler.instance;
    }
    this.mqttClient = null;
    this.host = process.env.mqttURL;
    this.username = process.env.mqttUsername;
    this.password = process.env.mqttPassword;
  }

  connect() {
    this.mqttClient = mqtt.connect(this.host, {
      username: this.username,
      password: this.password,
      reconnectPeriod: 5000
    });

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log("Error:", err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log("MQTT Connected!");
    });

    this.mqttClient.on("reconnect", () => {
      console.log("Reconnecting to MQTT broker");
    });

    // mqtt subscriptions
    this.mqttClient.subscribe(`logs/#`, { qos: 2 });
    this.mqttClient.subscribe(`siren/#`, { qos: 2 });

    // When a message arrives, console.log it
    this.mqttClient.on("message", async function (topic, message) {
      console.log(topic, "\n", message.toString());

      if (topic.split("/")[0] === "logs") {
        saveLogs(message.toString(), topic.split("/")[1]);
      }

      if (topic.split("/")[0] === "siren") {
        activateSiren(topic.split("/")[1]);
      }
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  publishNewAcl = async (lockid, aclList) => {
    this.mqttClient.publish(`acl/${lockid}`, JSON.stringify(aclList), {
      qos: 2,
    });
  };

  publishDisableSiren = async (lockid) => {
    console.log(lockid);
    this.mqttClient.publish(`deactivate_alert/${lockid}`, "disable_siren", {
      qos: 2,
    });
  };

  publishSystemState = async (lockid, isSystemEnabled) => {
    this.mqttClient.publish(
      `toggle_system/${lockid}`,
      isSystemEnabled ? "enable_system" : "disable_system",
      { qos: 2 }
    );
  };
}

module.exports = MqttHandler;
