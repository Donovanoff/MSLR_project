import mongoose from "mongoose";
import dotenv from "dotenv";
import ReferendumModel from "./models/Referendum.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const seedData = [
  {
    title: "Should Shangri-La pursue an expansion of its administrative boundaries to incorporate adjacent counties?",
    description: "Referendum regarding territorial expansion.",
    status: "open",
    options: [
      { id: "1", text: "Expand its boundaries to include all adjacent counties", votes: 0 },
      { id: "2", text: "Remain status quo", votes: 0 }
    ]
  },
  {
    title: "Should Shangri-La prohibit cigarette sales?",
    description: "Referendum regarding public health policies.",
    status: "open",
    options: [
      { id: "1", text: "Yes", votes: 0 },
      { id: "2", text: "No", votes: 0 }
    ]
  },
  {
    title: "Should the city invest budget surplus into building a new underground metro line?",
    description: "Referendum regarding public transport infrastructure improvement.",
    status: "open",
    options: [
      { id: "1", text: "Yes, build the metro", votes: 0 },
      { id: "2", text: "No, repair existing roads instead", votes: 0 }
    ]
  },
  {
    title: "Should the South Park area be converted into a renewable Solar Energy Farm?",
    description: "Referendum regarding green energy transition vs preserving public recreational zones.",
    status: "open",
    options: [
      { id: "1", text: "Convert to Solar Farm", votes: 0 },
      { id: "2", text: "Keep as a Public Park", votes: 0 }
    ]
  }
];

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('🌱 Connected to database...');
    
    //Clear existing referendums
    await ReferendumModel.deleteMany({});
    
    //Add seed referendums
    await ReferendumModel.insertMany(seedData);
    
    console.log('✅ Referendums added successfully!');
    process.exit();
  })
  .catch((err) => {
    console.log('❌ Error:', err);
    process.exit(1);
  });
