import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    line: Number,
    issue: String,
    fix: String,
    suggestion: String,
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    bugs: [issueSchema],
    performance: [issueSchema],
    security: [issueSchema],
    bestPractices: [issueSchema],
    improvedCode: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
