const router = require("express").Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// ➕ CREATE PROJECT (admin only)
router.post("/", auth, role("admin"), async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      members