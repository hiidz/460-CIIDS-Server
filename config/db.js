require('dotenv').config();
const mongoose = require('mongoose');
const db = `mongodb+srv://cs460-ciids:cs460-ciids@cs460.kiinvai.mongodb.net/cs460`;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {});

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;