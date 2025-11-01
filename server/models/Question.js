import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    course: { type: String, required: true, trim: true },
    semester: { type: Number, required: true },
    subject: { type: String, required: true, trim: true },
    examType: { type: String, required: true, enum: ["Mid Sem", "Final Sem"] },
    year: { type: Number, required: true },
    questionsText: { type: String },
    markdownContent: { type: String },
    fileUrl: {
      type: String,
      required: true,
    },
    filePublicId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
