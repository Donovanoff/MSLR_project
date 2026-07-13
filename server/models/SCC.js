import mongoose from 'mongoose';

const SCCSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  isUsed: {
    type: Boolean,
    default: false
  }
});

const SCCModel = mongoose.model('SCC', SCCSchema);

export default SCCModel;
