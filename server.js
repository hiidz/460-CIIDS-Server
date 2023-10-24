const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
// 
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

app.use(cors());

// Authentication routes
app.use('/', require('./routes/route')); // Assuming your auth routes are defined in auth.js

// const PORT = process.env.PORT || 8080;
const PORT =  8080;

app.listen(PORT, () => {
  console.log(`CIIDS backend service running on port ${PORT}`);
});

// Starts subscribing to addSong event
// amqpService.logSubscriber();
// amqpService.sirenSubscriber();