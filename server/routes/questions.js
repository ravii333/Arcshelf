import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import Question from "../models/Question.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";
import { formatToMarkdown } from "../utils/markdownFormatter.js";

const router = express.Router();
const upload = multer({ storage });

const populateOptions = {
  path: "college",
  select: "name slug university",
  populate: { path: "university", select: "name" },
};

// GET /questions?search=&examType=&year=&course=
router.get("/", async (req, res) => {
  try {
    const { search, examType, year, course } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },
        { questionsText: { $regex: search, $options: "i" } },
      ];
    }
    if (examType) query.examType = examType;
    if (year) query.year = Number(year);
    if (course) query.course = { $regex: course, $options: "i" };

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name")
      .populate(populateOptions);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions." });
  }
});

// GET /questions/:id/related — must be before /:id
router.get("/:id/related", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Not found." });

    const related = await Question.find({
      _id: { $ne: question._id },
      $or: [
        { course: question.course },
        { subject: { $regex: question.subject, $options: "i" } },
        { college: question.college },
      ],
    })
      .limit(4)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name")
      .populate(populateOptions);

    res.status(200).json(related);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch related questions." });
  }
});

// GET /questions/my - fetch logged in user's contributions
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const questions = await Question.find({ createdBy: req.userId })
      .sort({ createdAt: -1 })
      .populate(populateOptions);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your contributions." });
  }
});

// GET /questions/saved - fetch logged in user's saved/wishlisted papers
router.get("/saved", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "savedPapers",
      populate: [{ path: "createdBy", select: "name" }, populateOptions],
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    // savedPapers can contain nulls if a saved paper was later deleted; filter them out
    const saved = (user.savedPapers || []).filter(Boolean);
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved papers." });
  }
});

// POST /questions/:id/save - toggle save/unsave a paper for the logged in user
router.post("/:id/save", authMiddleware, async (req, res) => {
  try {
    const paper = await Question.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Question not found." });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const paperId = req.params.id;
    const index = user.savedPapers.findIndex((p) => p.toString() === paperId);

    let saved;
    if (index === -1) {
      user.savedPapers.push(paperId);
      saved = true;
    } else {
      user.savedPapers.splice(index, 1);
      saved = false;
    }

    await user.save();
    res.status(200).json({ saved, message: saved ? "Paper saved." : "Paper removed from saved." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update saved papers." });
  }
});

// GET /questions/:id
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("createdBy", "name")
      .populate(populateOptions);
    if (!question)
      return res.status(404).json({ message: "Question not found." });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question." });
  }
});

// POST /questions
router.post("/", authMiddleware, upload.single("paperFile"), async (req, res) => {
  try {
    const { collegeId, course, subject, semester, year, examType, questionsText } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a question paper file." });
    }

    const fileUrl = req.file.path;
    const filePublicId = req.file.filename;
    const markdownContent = formatToMarkdown({ course, subject, year, examType, questionsText });

    const newQuestion = new Question({
      college: collegeId || null,
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

    const populated = await Question.findById(newQuestion._id)
      .populate("createdBy", "name")
      .populate(populateOptions);

    res.status(201).json(populated);
  } catch (error) {
    console.error("Question submission error:", error);
    res.status(409).json({ message: "Failed to submit question.", error: error.message });
  }
});

// DELETE /questions/:id - delete a question
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found." });

    if (question.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized. You can only delete your own papers." });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Question paper deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question." });
  }
});

export default router;
