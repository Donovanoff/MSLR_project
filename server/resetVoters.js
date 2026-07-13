import mongoose from "mongoose";
import dotenv from "dotenv";
import VoterModel from "./models/Voter.js";
import SCCModel from "./models/SCC.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
 
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('🌱 Connected to database...');

    try {
      //delete all voters
      const deleted = await VoterModel.deleteMany({});
      console.log(`❌ Deleted voters: ${deleted.deletedCount}`);

      //reset all SCC codes to isUsed: false
      const updated = await SCCModel.updateMany({}, { isUsed: false });
      console.log(`✅ Updated SCC codes`);

      console.log("✅ Done!");
      process.exit();
    } catch (err) {
      console.error("Error:", err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log("❌ Connection error:", err);
    process.exit(1);
  });
