const mqtt = require("mqtt");
const mqttService = {};

const Message = require("../models/Message")

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


  // called each time a message is received
  // Add logic to save to DB

/*   1. Publish logs
3. Publish/Subscribe siren activation/deactivation*/

// const lockid = req.params.lockid;
// const newACLObj = req.body.acl;

client.on('message', async function (topic, message) {
  // called each time a message is received
  const logMessage = message.toString()
  console.log('Received message:', topic, logMessage);
  try {
    const new_log = new Message
    await .save();
  } catch (err){
    console.log(err)
  }

});

// subscribe to topic 'my/test/topic'
// client.subscribe('my/test/topic');



// prints an error message
client.on('error', (error) => {
  console.log('Error:', error);
});

mqttService.publishNewAcl = async (lockid, aclList) => {
  client.publish(`acl/${lockid}`, JSON.stringify(aclList));
};

mqttService.logSubscriber = async (lockid) => {
  client.subscribe(`logs`)
}

// subscribe to topic 'my/test/topic'
// client.subscribe('my/test/topic');

module.exports = mqttService;
