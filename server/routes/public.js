import express from "express";
import ReferendumModel from "../models/Referendum.js";

const router = express.Router();

router.get("/referendums", async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = status ? { status: status } : {};
    
    const referendums = await ReferendumModel.find(filter);

    const formattedData = referendums.map(ref => ({
      "referendum_id": ref._id,
      "status": ref.status,
      "referendum_title": ref.title,
      "referendum_desc": ref.description,
      "referendum_options": {
        "options": ref.options.map(opt => ({
          [opt.id]: opt.text,
          "votes": opt.votes.toString()
        }))
      }
    }));

    res.json({ "Referendums": formattedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/referendum/:id", async (req, res) => {
  try {
    const ref = await ReferendumModel.findById(req.params.id);
    
    if (!ref) {
      return res.status(404).json({ message: "Referendum not found" });
    }

    const formattedRef = {
      "referendum_id": ref._id,
      "status": ref.status,
      "referendum_title": ref.title,
      "referendum_desc": ref.description,
      "referendum_options": {
        "options": ref.options.map(opt => ({
          [opt.id]: opt.text,
          "votes": opt.votes.toString()
        }))
      }
    };

    res.json(formattedRef);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID format or Server Error" });
  }
});

export default router;
