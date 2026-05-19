const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://admin123:TollSync%40123@cluster0.dstrgmu.mongodb.net/TollSync?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/vehicles", vehicleRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});