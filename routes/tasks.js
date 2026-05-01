const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// =====================
// ➕ CREATE TASK (Admin only)
// =====================
router.post("/", auth, role("admin"), async (req, res) => {
  try {
    const { title, assignedTo, dueDate, project } = req.body;

    const task = await Task.create({
      title,
      assignedTo,
      dueDate,
      project
    });

    res.status(201).json(task);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 📄 GET ALL TASKS
// =====================
router.get("/", auth, role("admin", "member"), async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo project");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// ✏️ UPDATE TASK STATUS
// =====================
router.put("/:id/status", auth, role("admin", "member"), async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 🗑️ DELETE TASK (Admin only)
// =====================
router.delete("/:id", auth, role("admin"), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// 📊 DASHBOARD API
// =====================
router.get("/dashboard", auth, role("admin", "member"), async (req, res) => {
  try {
    const today = new Date();

    const totalTasks = await Task.countDocuments();
    const pendingTasks = await Task.countDocuments({ status: "Pending" });
    const completedTasks = await Task.countDocuments({ status: "Completed" });

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: today },
      status: { $ne: "Completed" }
    });

    const tasks = await Task.find().populate("assignedTo project");

    res.json({
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
      tasks
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;