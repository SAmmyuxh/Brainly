import { Request, Response } from "express"
import Content from "../Models/Content";
import Link from "../Models/Link";
import { hash } from "bcrypt";
import { random, extractMetadata } from "../utils/utils";
import User from "../Models/User";
enum ResponseStatus {
    Success = 200,
    NotFound = 404,
    Error = 500,
    AlreadyExists = 403,
    BadRequest = 400
}
export const newcontentcontroller = async (req: Request, res: Response) => {
    try {
        const { link, type, title, description, tags, content } = req.body;

        let meta: any = {};
        if (link && (type === 'link' || type === 'article' || type === 'document')) {
            meta = await extractMetadata(link) || {};
        }

        await Content.create({
            link: link,
            type: type,
            title: title || meta.title || "Untitled",
            description: description || meta.description,
            content: content,
            userId: req.userId,
            tags: tags,
            thumbnail: meta.image
        })
        res.status(ResponseStatus.Success).json({
            message: "Content Added"
        })
    } catch (error) {
        console.error(error)
        res.status(ResponseStatus.Error).json({
            message: "Content could not be added"
        })
    }
}

export const getcontentcontroller = async (req: Request, res: Response) => {

    try {
        const userId = req.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;
        const search = req.query.search as string;

        let query: any = { userId };
        let sortBy: any = { createdAt: -1 };

        // If search query provided, use text search or regex fallback
        if (search && search.trim()) {
            const searchTerm = search.trim();

            // Try text search first (for exact phrase matches)
            try {
                query = {
                    userId,
                    $text: { $search: searchTerm }
                };
                sortBy = { score: { $meta: 'textScore' }, createdAt: -1 };
            } catch {
                // Fallback to regex search for partial matches
                const regex = new RegExp(searchTerm, 'i');
                query = {
                    userId,
                    $or: [
                        { title: regex },
                        { description: regex },
                        { tags: { $in: [regex] } },
                        { content: regex }
                    ]
                };
            }
        }

        const total = await Content.countDocuments(query);

        // Build aggregation or find based on search
        let content;
        if (search && search.trim()) {
            content = await Content.find(query, { score: { $meta: 'textScore' } })
                .populate('userId', 'username')
                .sort(sortBy)
                .skip(skip)
                .limit(limit);
        } else {
            content = await Content.find(query)
                .populate('userId', 'username')
                .sort(sortBy)
                .skip(skip)
                .limit(limit);
        }

        res.status(ResponseStatus.Success).json({
            content,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            },
            search: search || null
        })
    } catch (error) {
        console.error(error)
        res.status(ResponseStatus.Error).json({
            message: "Could not fetch content"
        })
    }
}

export const deletecontroller = async (req: Request, res: Response) => {
    const contentid = req.body.contentid;
    try {
        await Content.deleteOne({ _id: contentid, userId: req.userId })

        res.status(ResponseStatus.Success).json({
            message: "Delete Successfull"
        })
    } catch (error) {
        res.status(ResponseStatus.Error).json({
            message: "Could not delete the specified content"
        })
    }
}

export const sharecontroller = async (req: Request, res: Response) => {
    const share = req.body.share;
    try {
        if (share) {

            const existingLink = await Link.findOne({ userId: req.userId });
            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await Link.create({

                userId: req.userId,
                hash: hash
            })
            res.json({
                hash
            })
        } else {
            await Link.deleteOne({
                userId: req.userId
            })
            res.json({
                message: "Removed link"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(ResponseStatus.Error).json({
            message: "Could not generate sharable link"
        })
    }
}

export const linkcontroller = async (req: Request, res: Response) => {
    const hash = req.params.shareLink;
    const link = await Link.findOne({
        hash
    })
    if (!link) {
        res.json({
            message: "Incorrect Input"
        })
        return;
    }
    const content = await Content.find({
        userId: link.userId
    }).populate("userId", "username")

    const user = await User.findOne({
        _id: link.userId
    })
    if (!user) {
        res.status(ResponseStatus.Error).json({
            message: "user not found,error ideally should not happen"
        })
        return;
    }

    res.status(ResponseStatus.Success).json({
        user: user.username,
        content: content
    })
}

export const updateContentController = async (req: Request, res: Response) => {
    const { contentid, title, link, tags, description, type } = req.body;
    try {
        await Content.updateOne({ _id: contentid, userId: req.userId }, {
            title, link, tags, description, type
        })
        res.status(ResponseStatus.Success).json({
            message: "Content Updated"
        })
    } catch (error) {
        res.status(ResponseStatus.Error).json({
            message: "Could not update content"
        })
    }
}

// Check if link is alive
export const checkLinkController = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;
        if (!url) {
            res.status(ResponseStatus.BadRequest).json({ message: "URL is required" });
            return;
        }

        try {
            // Try HEAD first, fall back to GET with short timeout
            const response = await fetch(url, {
                method: 'HEAD',
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BrainlyBot/1.0)' },
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                res.status(ResponseStatus.Success).json({ status: 'alive', code: response.status });
            } else {
                res.status(ResponseStatus.Success).json({ status: 'dead', code: response.status });
            }
        } catch (error) {
            // Retry with GET if HEAD fails (some servers block HEAD)
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BrainlyBot/1.0)' },
                    signal: AbortSignal.timeout(5000)
                });
                if (response.ok) {
                    res.status(ResponseStatus.Success).json({ status: 'alive', code: response.status });
                } else {
                    res.status(ResponseStatus.Success).json({ status: 'dead', code: response.status || 0 });
                }
            } catch (e) {
                res.status(ResponseStatus.Success).json({ status: 'dead' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not check link" });
    }
}

export const getTagsController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const tags = await Content.distinct("tags", { userId });
        res.status(ResponseStatus.Success).json({
            tags
        });
    } catch (error) {
        res.status(ResponseStatus.Error).json({
            message: "Could not fetch tags"
        });
    }
}