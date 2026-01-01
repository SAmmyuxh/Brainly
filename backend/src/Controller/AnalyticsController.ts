import { Request, Response } from "express";
import Content from "../Models/Content";
import Folder from "../Models/Folder";

enum ResponseStatus {
    Success = 200,
    Error = 500
}

export const getAnalyticsController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        // Total content count
        const totalContent = await Content.countDocuments({ userId });

        // Content by type
        const contentByType = await Content.aggregate([
            { $match: { userId: { $eq: userId } } },
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Favorites count
        const favoritesCount = await Content.countDocuments({ userId, isFavorite: true });

        // Folders count
        const foldersCount = await Folder.countDocuments({ userId });

        // Content with tags
        const taggedContent = await Content.countDocuments({
            userId,
            tags: { $exists: true, $ne: [] }
        });

        // Content over time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const contentOverTime = await Content.aggregate([
            {
                $match: {
                    userId: { $eq: userId },
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top tags
        const topTags = await Content.aggregate([
            { $match: { userId: { $eq: userId } } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Recent activity (last 7 items)
        const recentActivity = await Content.find({ userId })
            .sort({ createdAt: -1 })
            .limit(7)
            .select('title type createdAt');

        res.status(ResponseStatus.Success).json({
            analytics: {
                totalContent,
                favoritesCount,
                foldersCount,
                taggedContent,
                contentByType: contentByType.map(item => ({
                    type: item._id,
                    count: item.count
                })),
                contentOverTime: contentOverTime.map(item => ({
                    date: item._id,
                    count: item.count
                })),
                topTags: topTags.map(item => ({
                    tag: item._id,
                    count: item.count
                })),
                recentActivity: recentActivity.map(item => ({
                    title: item.title,
                    type: item.type,
                    date: item.createdAt
                }))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not fetch analytics" });
    }
};
