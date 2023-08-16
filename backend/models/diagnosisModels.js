// diagnosisModels.js

import mongoose from "mongoose";

const diagnosisSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  diagnosingDoctor: {
    type: String,
    required: true,
  },
});

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

export default Diagnosis;
