import Resume from '../models/Resume.js';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { processResumeWithAI } from '../services/aiService.js';

export const processResume = async (req, res) => {
  try {
    const { jobDescription, experienceLevel } = req.body;
    
    if (!req.file || !jobDescription || !experienceLevel) {
      return res.status(400).json({ message: "Please provide resume PDF, job description, and experience level" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    const finalState = await processResumeWithAI(resumeText, jobDescription, experienceLevel);

    const resume = await Resume.create({
      user: req.user._id,
      originalFile: req.file.path,
      parsedText: resumeText,
      jobDescription,
      experienceLevel,
      atsBreakdown: finalState.atsBreakdown,
      resumeTextAnalysis: finalState.resumeTextAnalysis,
      interviewQuestions: finalState.interviewQuestions
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
