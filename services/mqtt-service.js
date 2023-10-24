const mqtt = require("mqtt");
const mqttService = {};

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
client.on('connect', () => {
  console.log('MQTT Connected!');
});

// prints an error message
client.on('error', (error) => {
  console.log('Error:', error);
});

mqttService.publishNewAcl = async (lockid, aclList) => {
  client.publish(`acl/${lockid}`, JSON.stringify(aclList));
};

module.exports = mqttService;
