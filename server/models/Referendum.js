import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const ReferendumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'open' },
  options: [OptionSchema]
});

const ReferendumModel = mongoose.model("Referendum", ReferendumSchema);

export default ReferendumModel;
