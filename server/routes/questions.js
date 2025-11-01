import express from 'express';
import multer from 'multer'; // <-- Added multer
import { storage } from '../config/cloudinary.js'; // <-- Added cloudinary config
import Question from '../models/Question.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { formatToMarkdown } from '../utils/markdownFormatter.js';

const router = express.Router();
// Initialize multer with our Cloudinary storage engine
const upload = multer({ storage });

// --- GET ALL QUESTIONS ROUTE (No changes needed) ---
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

// --- GET SINGLE QUESTION ROUTE (No changes needed) ---
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

// --- UPDATED POST ROUTE with FILE UPLOAD ---
// 1. Add the middleware: `upload.single('paperFile')`
//    'paperFile' must match the name of the file input field in your frontend form.
router.post('/', authMiddleware, upload.single('paperFile'), async (req, res) => {
  try {
    // 2. The text fields are now in `req.body`
    const { collegeId, course, subject, semester, year, examType, questionsText } = req.body;
    
    // 3. The uploaded file information is now in `req.file`
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a question paper file.' });
    }
    // The secure URL is at `req.file.path`
    // The public ID for managing the file (e.g., deleting) is `req.file.filename`
    const fileUrl = req.file.path;
    const filePublicId = req.file.filename;

    // 4. Your markdown formatter can still be used
    const questionDataForMarkdown = { course, subject, year, examType, questionsText };
    const markdownContent = formatToMarkdown(questionDataForMarkdown);

    // 5. Create the new Question document with the file info
    const newQuestion = new Question({
      college: collegeId,
      course,
      subject,
      semester,
      year,
      examType,
      questionsText,
      markdownContent,
      fileUrl, // <-- Add the file URL from Cloudinary
      filePublicId, // <-- Add the public ID
      createdBy: req.userId,
    });
    
    await newQuestion.save();
    
    // 6. Populate the response just like before
    const populatedQuestion = await Question.findById(newQuestion._id)
                                      .populate('createdBy', 'name')
                                      .populate({ // Use the same deep populate
                                        path: 'college',
                                        populate: { path: 'university' }
                                      });

    res.status(201).json(populatedQuestion);

  } catch (error) {
    console.error("Question submission error:", error);
    // TODO: If submission fails, we should ideally delete the uploaded file from Cloudinary
    res.status(409).json({ message: 'Failed to submit question.', error: error.message });
  }
});

export default router;