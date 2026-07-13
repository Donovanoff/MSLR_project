import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import referendumRoutes from "./routes/referendums.js";
import voteRoutes from "./routes/vote.js";
import publicRoutes from "./routes/public.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ Error:", err));

app.use(cors());
app.use(express.json());

// Main App API Routes
app.use("/api", authRoutes); // handles /api/register and /api/login
app.use("/api/referendums", referendumRoutes);
app.use("/api/vote", voteRoutes);

// Open Data API (Task 2)
app.use("/mslr", publicRoutes); // handles /mslr/referendums and /mslr/referendum/:id

app.listen(PORT, () => {
  console.log(`\n------------------------------\nServer is running on port ${PORT}`);
});
