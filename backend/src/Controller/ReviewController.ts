import { Request, Response } from "express";
import Review from "../Models/Review";
import Content from "../Models/Content";

enum ResponseStatus {
    Success = 200,
    NotFound = 404,
    Error = 500,
    BadRequest = 400
}

// SM-2 Algorithm implementation
function calculateSM2(quality: number, easeFactor: number, interval: number, repetitions: number) {
    // quality: 0-5 rating (0-2 = fail, 3-5 = pass)
    let newEF = easeFactor;
    let newInterval = interval;
    let newReps = repetitions;

    if (quality >= 3) {
        // Correct response
        if (repetitions === 0) {
            newInterval = 1;
        } else if (repetitions === 1) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * easeFactor);
        }
        newReps = repetitions + 1;
    } else {
        // Incorrect response - reset
        newReps = 0;
        newInterval = 1;
    }

    // Update ease factor
    newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEF < 1.3) newEF = 1.3;

    return { easeFactor: newEF, interval: newInterval, repetitions: newReps };
}

// Add content to review queue
export const addToReviewController = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.body;
        const userId = req.userId;

        // Check if already in review
        const existing = await Review.findOne({ contentId, userId });
        if (existing) {
            res.status(ResponseStatus.BadRequest).json({ message: "Already in review queue" });
            return;
        }

        const review = await Review.create({
            contentId,
            userId,
            nextReviewDate: new Date()
        });

        res.status(ResponseStatus.Success).json({ review, message: "Added to review queue" });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not add to review" });
    }
};

// Get items due for review
export const getDueReviewsController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const limit = parseInt(req.query.limit as string) || 10;

        const reviews = await Review.find({
            userId,
            nextReviewDate: { $lte: new Date() }
        })
            .populate({
                path: 'contentId',
                select: 'title description type link content tags'
            })
            .sort({ nextReviewDate: 1 })
            .limit(limit);

        const count = await Review.countDocuments({
            userId,
            nextReviewDate: { $lte: new Date() }
        });

        res.status(ResponseStatus.Success).json({
            reviews,
            dueCount: count
        });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not fetch reviews" });
    }
};

// Submit review response (quality 0-5)
export const submitReviewController = async (req: Request, res: Response) => {
    try {
        const { reviewId, quality } = req.body;
        const userId = req.userId;

        if (quality < 0 || quality > 5) {
            res.status(ResponseStatus.BadRequest).json({ message: "Quality must be 0-5" });
            return;
        }

        const review = await Review.findOne({ _id: reviewId, userId });
        if (!review) {
            res.status(ResponseStatus.NotFound).json({ message: "Review not found" });
            return;
        }

        // Calculate new SM-2 values
        const sm2 = calculateSM2(
            quality,
            review.easeFactor,
            review.interval,
            review.repetitions
        );

        // Update status based on performance
        let status = review.status;
        if (quality >= 4 && sm2.repetitions >= 3) {
            status = 'mastered';
        } else if (quality >= 3) {
            status = 'reviewing';
        } else {
            status = 'learning';
        }

        // Update review
        review.easeFactor = sm2.easeFactor;
        review.interval = sm2.interval;
        review.repetitions = sm2.repetitions;
        review.lastReviewDate = new Date();
        review.nextReviewDate = new Date(Date.now() + sm2.interval * 24 * 60 * 60 * 1000);
        review.totalReviews += 1;
        if (quality >= 3) review.correctCount += 1;
        review.status = status;

        await review.save();

        res.status(ResponseStatus.Success).json({
            review,
            message: `Review recorded. Next review in ${sm2.interval} day(s)`
        });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not submit review" });
    }
};

// Get review stats for user
export const getReviewStatsController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        const stats = await Review.aggregate([
            { $match: { userId: { $eq: userId } } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const dueToday = await Review.countDocuments({
            userId,
            nextReviewDate: { $lte: new Date() }
        });

        const totalReviews = await Review.aggregate([
            { $match: { userId: { $eq: userId } } },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: '$totalReviews' },
                    correctCount: { $sum: '$correctCount' }
                }
            }
        ]);

        res.status(ResponseStatus.Success).json({
            stats: {
                byStatus: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
                dueToday,
                totalReviews: totalReviews[0]?.totalReviews || 0,
                correctCount: totalReviews[0]?.correctCount || 0,
                accuracy: totalReviews[0]?.totalReviews
                    ? Math.round((totalReviews[0].correctCount / totalReviews[0].totalReviews) * 100)
                    : 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not fetch stats" });
    }
};

// Remove from review queue
export const removeFromReviewController = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.body;
        const userId = req.userId;

        await Review.deleteOne({ contentId, userId });

        res.status(ResponseStatus.Success).json({ message: "Removed from review queue" });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not remove from review" });
    }
};
