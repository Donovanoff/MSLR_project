import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import VoterModel from "../models/Voter.js";
import SCCModel from "../models/SCC.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { email, fullName, dob, password, scc } = req.body;

    const cleanEmail = email.toLowerCase().trim();
    const cleanSCC = scc.trim();
    const cleanName = fullName.trim();

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "Error: You must be at least 18 years old to register.",
      });
    }

    const existingUser = await VoterModel.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Error: This email is already registered!",
      });
    }

    const nameRegex = /^[a-zA-Z\s'-]+$/;

    if (!nameRegex.test(cleanName)) {
      return res.status(400).json({
        success: false,
        message: "Error: Name cannot contain numbers or special characters!",
      });
    }

    const formattedName = cleanName
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    if (password.includes(" ")) {
      return res.status(400).json({
        success: false,
        message: "Error: Password cannot contain spaces!",
      });
    }
  
    const validCode = await SCCModel.findOne({ code: cleanSCC });
    if (!validCode) {
      return res.status(400).json({
        success: false,
        message: "Error: Invalid SCC code!",
      });
    }
    if (validCode.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Error: This SCC code has already been used!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newVoter = await VoterModel.create({
      email: cleanEmail,
      fullName: formattedName,
      dob,
      password: hashedPassword,
      scc: cleanSCC,
      hasVotedIn: []
    });

    validCode.isUsed = true;
    await validCode.save();

    res.status(201).json({
      success: true,
      message: `Welcome, ${formattedName}! Registration successful.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (cleanEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ userId: "admin", role: "admin" }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({
        success: true,
        message: "Welcome, Election Commission!",
        token: token,
        user: {
          _id: "admin",
          fullName: "Election Commission",
          email: ADMIN_EMAIL,
          role: "admin",
          hasVotedIn: []
        },
      });
    }

    const user = await VoterModel.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or password!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or password!",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: "voter" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`User ${user.fullName} logged in.`);

    res.json({
      success: true,
      message: "Login successful!",
      token: token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: "voter",
        hasVotedIn: user.hasVotedIn
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
