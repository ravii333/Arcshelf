import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    college: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "College" 
    },
    course: { 
      type: String, 
      required: true, 
      trim: true 
    },
    semester: { 
      type: Number, 
      required: true 
    },
    subject: { 
      type: String, 
      required: true, 
      trim: true 
    },
    examType: { 
      type: String, 
      required: true, 
      enum: ["Mid Sem", "End Sem", "Sessional", "Practical", "Quiz", "Assignment"]
    },
    year: {
      type: Number,
      required: true,
      min: [1980, "Year seems too old."],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future."],
    },
    questionsText: {
      type: String
    },
    markdownContent: {
      type: String
    },
    fileUrl: {
      type: String,
      required: true,
    },
    filePublicId: {
      type: String,
      required: true,
    },
    // Cloudinary resource type ("raw" for PDFs, "image" for images) — needed to
    // destroy the asset correctly when a paper is deleted.
    fileResourceType: {
      type: String,
      enum: ["raw", "image"],
      default: "raw",
    },
    // Moderation state. Defaults to "approved" so existing behaviour is unchanged;
    // set the default to "pending" to enforce review-before-publish.
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    views: {
      type: Number,
      default: 0,
    },
    // Admin's note when moderating — shown to the uploader (esp. the reason a
    // paper was rejected).
    moderationNote: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes to support browse filters & sorting without full collection scans.
QuestionSchema.index({ status: 1, createdAt: -1 });
QuestionSchema.index({ course: 1 });
QuestionSchema.index({ year: 1 });
QuestionSchema.index({ examType: 1 });
QuestionSchema.index({ college: 1 });
// Text index for relevance search across the main free-text fields.
QuestionSchema.index({ subject: "text", course: "text", questionsText: "text" });

export default mongoose.model("Question", QuestionSchema);
