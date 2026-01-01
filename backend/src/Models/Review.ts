import mongoose, { Types } from "mongoose";

// Review model for spaced repetition learning
// Uses SM-2 algorithm for calculating next review intervals
const ReviewSchema = new mongoose.Schema({
    contentId: { type: Types.ObjectId, ref: 'Content', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },

    // SM-2 algorithm parameters
    easeFactor: { type: Number, default: 2.5 }, // EF >= 1.3
    interval: { type: Number, default: 1 }, // Days until next review
    repetitions: { type: Number, default: 0 }, // Successful review streak

    // Review scheduling
    nextReviewDate: { type: Date, default: Date.now },
    lastReviewDate: { type: Date },

    // Stats
    totalReviews: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },

    // Learning status
    status: {
        type: String,
        enum: ['new', 'learning', 'reviewing', 'mastered'],
        default: 'new'
    }
}, { timestamps: true });

// Compound index for user's reviews
ReviewSchema.index({ userId: 1, nextReviewDate: 1 });
ReviewSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);
