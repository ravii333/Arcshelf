import express from 'express';
import multer from 'multer'; 
import { storage } from '../config/cloudinary.js';
import Question from '../models/Question.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { formatToMarkdown } from '../utils/markdownFormatter.js';

const router = express.Router();
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name')
      .populate({
        path: 'college',
        select: 'name slug university',
        populate: {
          path: 'university',
          select: 'name'
        }
      });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate({
        path: 'college',
        select: 'name slug university',
        populate: {
          path: 'university',
          select: 'name'
        }
      });
    if (!question) return res.status(404).json({ message: 'Question not found.' });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch question.' });
  }
});

router.post('/', authMiddleware, upload.single('paperFile'), async (req, res) => {
  try {

    const { collegeId, course, subject, semester, year, examType, questionsText } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a question paper file.' });
    }

    const fileUrl = req.file.path;
    const filePublicId = req.file.filename;

    const questionDataForMarkdown = { course, subject, year, examType, questionsText };
    const markdownContent = formatToMarkdown(questionDataForMarkdown);

    const newQuestion = new Question({
      college: collegeId,
      course,
      subject,
      semester,
      year,
      examType,
      questionsText,
      markdownContent,
      fileUrl, 
      filePublicId, 
      createdBy: req.userId,
    });
    
    await newQuestion.save();
    
    const populatedQuestion = await Question.findById(newQuestion._id)
                                      .populate('createdBy', 'name')
                                      .populate({ 
                                        path: 'college',
                                        populate: { path: 'university' }
                                      });

    res.status(201).json(populatedQuestion);

  } catch (error) {
    console.error("Question submission error:", error);
    res.status(409).json({ message: 'Failed to submit question.', error: error.message });
  }
});

export default router;