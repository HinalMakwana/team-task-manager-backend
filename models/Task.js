const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  dueDate: Date,

  status: {
    type: String,
    default: "Pending"
  }
});

module.exports = mongoose.model("Task", taskSchema);