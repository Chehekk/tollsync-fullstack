const express = require("express");

const router = express.Router();

const Vehicle = require("../models/Vehicle");


// GET vehicles
router.get("/", async (req, res) => {
  const vehicles =
    await Vehicle.find();

  res.json(vehicles);
});


// ADD vehicle
router.post("/", async (req, res) => {

  const newVehicle =
    new Vehicle(req.body);

  await newVehicle.save();

  res.json(newVehicle);
});


// DELETE vehicle
router.delete("/:id", async (req, res) => {

  await Vehicle.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Vehicle Deleted",
  });
});

module.exports = router;