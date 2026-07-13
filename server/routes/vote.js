import express from "express";
import VoterModel from "../models/Voter.js";
import ReferendumModel from "../models/Referendum.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, referendumId, optionId } = req.body;

  try {
    const user = await VoterModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.hasVotedIn.includes(referendumId)) {
      return res.status(400).json({ message: "You have already voted in this referendum!" });
    }

    const ref = await ReferendumModel.findById(referendumId);
    if (!ref) {
      return res.status(404).json({ message: "Referendum not found" });
    }

    if (ref.status !== 'open') {
      return res.status(400).json({ message: "Voting is closed!" });
    }

    const option = ref.options.find(opt => opt.id === optionId);
    if (!option) {
      return res.status(400).json({ message: "Option not found" });
    }

    option.votes += 1;

    const totalVoters = await VoterModel.countDocuments();

    if (totalVoters > 0 && option.votes >= (totalVoters / 2)) {
      ref.status = 'closed';
      console.log(`🔒 Referendum closed!`);
    }

    await ref.save();

    user.hasVotedIn.push(referendumId);
    await user.save();

    res.json({ 
      success: true, 
      message: "Successfully voted!",
      isClosedNow: ref.status === 'closed' 
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
