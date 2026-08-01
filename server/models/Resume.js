import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalFile: { type: String, required: true },
  parsedText: { type: String, required: true },
  jobDescription: { type: String, required: true },
  experienceLevel: { type: String, enum: ['Fresher', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  atsBreakdown: {
    keywordMatch: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 },
    sectionCompleteness: { type: Number, default: 0 },
    experienceAlignment: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 }
  },
  resumeTextAnalysis: [{
    quote: { type: String },
    type: { type: String, enum: ['Mistake', 'Good Match', 'Bad Match', 'Suggestion'] },
    feedback: { type: String }
  }],
  interviewQuestions: [{
    category: { type: String, enum: ['Topic', 'Project'] },
    topicName: { type: String },
    question: { type: String },
    answer: { type: String }
  }]
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
