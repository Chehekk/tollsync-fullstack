// vehicle model
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  number: String,
  owner: String,
  type: String,
  balance: Number,
});

module.exports = mongoose.model(
  "Vehicle",
  vehicleSchema
);