const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware (MUST come first)
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});