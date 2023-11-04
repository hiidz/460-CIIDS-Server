const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const mqttHandler = require('./config/mqtt-handler');

// Connect Database
connectDB();

// Connect MQTT
const mqttClient = new mqttHandler();
mqttClient.connect();

// Init Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Authentication routes
app.use("/", require("./routes/route")); // Assuming your auth routes are defined in auth.js

// const PORT = process.env.PORT || 8080;
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`CIIDS backend service running on port ${PORT}`);
});


// Export the Express API
module.exports = app;