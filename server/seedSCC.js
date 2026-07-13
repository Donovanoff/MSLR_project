import mongoose from "mongoose";
import dotenv from "dotenv";
import SCCModel from "./models/SCC.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const myCodes = [
  "1AZN0FXJVM",
  "JOV50TOSYR",
  "SDUBJ5IOYB",
  "YFUVLYBQZR",
  "IGBQET8OOY",
  "R2ZHBUYO2V",
  "Z9HOC1LF4X",
  "9IJKHGHJK4",
  "N5J53QK9FO",
  "ZDN06T01V9",
  "4XRDN9O4AW",
  "921664ML8D",
  "A546AKU16A",
  "V0GB2G690L",
  "12EOU5RGVX",
  "0IXYCAH8UW",
  "GKJ3K1YBGE",
  "46HJV9KH1F",
  "S6K3AV3IVR",
  "IKKSZYJTSH",
];

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('🌱 Connected to database...');

    try {
      // delete old codes to avoid duplicates
      await SCCModel.deleteMany({});
      
      // prepare new codes
      const docs = myCodes.map((code) => ({ code: code, isUsed: false }));

      // insert them
      await SCCModel.insertMany(docs);
      
      console.log(`✅ ${docs.length} SCC codes added successfully!`);
      process.exit();
    } catch (err) {
      console.error("Error:", err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log('❌ Connection error:', err);
    process.exit(1);
  });
