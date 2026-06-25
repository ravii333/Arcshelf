import mongoose from "mongoose";

const collegeSchema = mongoose.Schema(
  {
     university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true 
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

const College = mongoose.model('College', collegeSchema);

export default College;