import express from "express";
import ReferendumModel from "../models/Referendum.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const referendums = await ReferendumModel.find();
    res.json(referendums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newRef = new ReferendumModel({
      title: req.body.title,
      description: req.body.description,
      status: "draft",
      options: req.body.options
    });
    await newRef.save();
    res.json({ success: true, message: "Referendum created!", data: newRef });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status, title, description, options } = req.body;
    const ref = await ReferendumModel.findById(req.params.id);
    
    if (!ref) return res.status(404).json({ message: "Not found" });

    if (status) ref.status = status;
    
    if (title) ref.title = title;
    if (description) ref.description = description;
    if (options) ref.options = options;

    await ref.save();
    res.json({ success: true, message: "Updated!", data: ref });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await ReferendumModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
