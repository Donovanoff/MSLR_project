import mongoose from 'mongoose';

const VoterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: { 
    type: String, 
    required: true,
    trim: true
  },
  dob: { 
    type: String, 
    required: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  scc: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  hasVotedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Referendum' }]
});

const VoterModel = mongoose.model('Voter', VoterSchema);

export default VoterModel;
