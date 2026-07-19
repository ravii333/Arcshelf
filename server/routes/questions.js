import express from "express";
import multer from "multer";
import { storage, cloudinary } from "../config/cloudinary.js";
import Question from "../models/Question.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import User from "../models/userModel.js";
import College from "../models/collegeModel.js";
import University from "../models/universityModel.js";
import { formatToMarkdown } from "../utils/markdownFormatter.js";

const router = express.Router();

// Restrict uploads to PDFs/images and cap the size (also enforced by Cloudinary).
const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    cb(new Error("Only PDF, JPG, or PNG files are allowed."));
  },
});

// Escape user input before using it inside a $regex to avoid ReDoS / invalid patterns.
const escapeRegex = (str = "") => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Derive the Cloudinary resource_type ("raw" for PDFs, "image" otherwise).
const resourceTypeFor = (file) =>
  file?.mimetype === "application/pdf" ? "raw" : "image";

const populateOptions = {
  path: "college",
  select: "name slug university",
  populate: { path: "university", select: "name" },
};

// GET /questions?search=&examType=&year=&course=&page=&limit=
// Returns a paginated envelope: { items, total, page, pages }.
router.get("/", async (req, res) => {
  try {
    const { search, examType, year, course } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 60);

    // Show everything except explicitly rejected papers. Using $ne (rather than
    // status:"approved") keeps legacy documents that predate the status field
    // visible. To enforce strict pre-publish moderation, change the model default
    // to "pending" and switch this to { status: "approved" }.
    const query = { status: { $ne: "rejected" } };

    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { subject: { $regex: safe, $options: "i" } },
        { course: { $regex: safe, $options: "i" } },
        { questionsText: { $regex: safe, $options: "i" } },
      ];
    }
    if (examType) query.examType = examType;
    if (year) query.year = Number(year);
    if (course) query.course = { $regex: escapeRegex(course), $options: "i" };

    const [items, total] = await Promise.all([
      Question.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("createdBy", "name")
        .populate(populateOptions),
      Question.countDocuments(query),
    ]);

    res.status(200).json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
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
      status: { $ne: "rejected" },
      $or: [
        { course: question.course },
        { subject: { $regex: escapeRegex(question.subject), $options: "i" } },
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

// GET /questions/stats - public counts for the homepage stats bar
router.get("/stats", async (req, res) => {
  try {
    const [papers, colleges, universities, students] = await Promise.all([
      Question.countDocuments({ status: { $ne: "rejected" } }),
      College.countDocuments(),
      University.countDocuments(),
      User.countDocuments(),
    ]);
    res.status(200).json({ papers, colleges, universities, students });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

// GET /questions/pending - admin: papers awaiting moderation
router.get("/pending", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const questions = await Question.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name")
      .populate(populateOptions);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending papers." });
  }
});

// GET /questions/admin?status=pending|approved|rejected|all&page=&limit=
// Admin moderation listing (paginated). "approved" also includes legacy papers
// that predate the status field.
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    let query = {};
    if (status === "pending") query = { status: "pending" };
    else if (status === "rejected") query = { status: "rejected" };
    else if (status === "approved") {
      query = { $or: [{ status: "approved" }, { status: { $exists: false } }] };
    }

    const [items, total, counts] = await Promise.all([
      Question.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("createdBy", "name")
        .populate(populateOptions),
      Question.countDocuments(query),
      Question.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    // Normalise the per-status counts (legacy docs with no status -> approved).
    const tally = { pending: 0, approved: 0, rejected: 0, total: 0 };
    for (const c of counts) {
      const key = c._id && tally[c._id] !== undefined ? c._id : "approved";
      tally[key] += c.count;
      tally.total += c.count;
    }

    res.status(200).json({
      items,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      counts: tally,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch papers." });
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

// PATCH /questions/:id/status - admin: approve or reject a paper
router.patch("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }
    // Keep the note for rejected papers; clear it once approved.
    const moderationNote = status === "rejected" ? (note || "").trim() : "";
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status, moderationNote },
      { new: true }
    );
    if (!question) return res.status(404).json({ message: "Question not found." });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status." });
  }
});

// GET /questions/:id
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
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

    // Reject exact duplicates (same college + subject + year + examType).
    const duplicate = await Question.findOne({
      college: collegeId || null,
      subject: { $regex: `^${escapeRegex(subject)}$`, $options: "i" },
      year: Number(year),
      examType,
    });
    if (duplicate) {
      // Best-effort cleanup of the just-uploaded file so we don't orphan it.
      try {
        await cloudinary.uploader.destroy(req.file.filename, {
          resource_type: resourceTypeFor(req.file),
        });
      } catch (_) { /* ignore cleanup errors */ }
      return res.status(409).json({ message: "This paper already exists." });
    }

    const fileUrl = req.file.path;
    const filePublicId = req.file.filename;
    const fileResourceType = resourceTypeFor(req.file);
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
      fileResourceType,
      createdBy: req.userId,
    });

    await newQuestion.save();

    const populated = await Question.findById(newQuestion._id)
      .populate("createdBy", "name")
      .populate(populateOptions);

    res.status(201).json(populated);
  } catch (error) {
    console.error("Question submission error:", error);
    res.status(400).json({ message: error.message || "Failed to submit question." });
  }
});

// DELETE /questions/:id - owner or admin
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found." });

    const requester = await User.findById(req.userId).select("role");
    const isOwner = question.createdBy.toString() === req.userId;
    const isAdmin = requester?.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized. You can only delete your own papers." });
    }

    // Remove the underlying Cloudinary asset so we don't leak storage.
    if (question.filePublicId) {
      try {
        await cloudinary.uploader.destroy(question.filePublicId, {
          resource_type: question.fileResourceType || "raw",
        });
      } catch (_) { /* ignore cleanup errors */ }
    }

    await Question.findByIdAndDelete(req.params.id);

    // Drop the paper from every user's saved list.
    await User.updateMany(
      { savedPapers: question._id },
      { $pull: { savedPapers: question._id } }
    );

    res.status(200).json({ message: "Question paper deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question." });
  }
});

export default router;
