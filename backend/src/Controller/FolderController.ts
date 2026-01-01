import { Request, Response } from "express";
import Folder from "../Models/Folder";
import Content from "../Models/Content";

enum ResponseStatus {
    Success = 200,
    NotFound = 404,
    Error = 500,
    BadRequest = 400
}

// Create a new folder
export const createFolderController = async (req: Request, res: Response) => {
    try {
        const { name, description, color, icon } = req.body;

        if (!name) {
            res.status(ResponseStatus.BadRequest).json({ message: "Folder name is required" });
            return;
        }

        const folder = await Folder.create({
            name,
            description,
            color,
            icon,
            userId: req.userId
        });

        res.status(ResponseStatus.Success).json({ folder, message: "Folder created" });
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(ResponseStatus.BadRequest).json({ message: "A folder with this name already exists" });
            return;
        }
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not create folder" });
    }
};

// Get all folders for the user
export const getFoldersController = async (req: Request, res: Response) => {
    try {
        const folders = await Folder.find({ userId: req.userId }).sort({ createdAt: -1 });

        // Get content count for each folder
        const foldersWithCount = await Promise.all(
            folders.map(async (folder) => {
                const count = await Content.countDocuments({ folderId: folder._id });
                return { ...folder.toObject(), contentCount: count };
            })
        );

        res.status(ResponseStatus.Success).json({ folders: foldersWithCount });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not fetch folders" });
    }
};

// Update a folder
export const updateFolderController = async (req: Request, res: Response) => {
    try {
        const { folderId, name, description, color, icon } = req.body;

        await Folder.updateOne(
            { _id: folderId, userId: req.userId },
            { name, description, color, icon }
        );

        res.status(ResponseStatus.Success).json({ message: "Folder updated" });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not update folder" });
    }
};

// Delete a folder (content will be orphaned, not deleted)
export const deleteFolderController = async (req: Request, res: Response) => {
    try {
        const { folderId } = req.body;

        // Remove folder reference from all content in this folder
        await Content.updateMany(
            { folderId, userId: req.userId },
            { $unset: { folderId: 1 } }
        );

        await Folder.deleteOne({ _id: folderId, userId: req.userId });

        res.status(ResponseStatus.Success).json({ message: "Folder deleted" });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not delete folder" });
    }
};

// Move content to a folder
export const moveToFolderController = async (req: Request, res: Response) => {
    try {
        const { contentId, folderId } = req.body;

        await Content.updateOne(
            { _id: contentId, userId: req.userId },
            { folderId: folderId || null }
        );

        res.status(ResponseStatus.Success).json({ message: "Content moved" });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not move content" });
    }
};

// Toggle favorite status
export const toggleFavoriteController = async (req: Request, res: Response) => {
    try {
        const { contentId } = req.body;

        const content = await Content.findOne({ _id: contentId, userId: req.userId });
        if (!content) {
            res.status(ResponseStatus.NotFound).json({ message: "Content not found" });
            return;
        }

        content.isFavorite = !content.isFavorite;
        await content.save();

        res.status(ResponseStatus.Success).json({
            isFavorite: content.isFavorite,
            message: content.isFavorite ? "Added to favorites" : "Removed from favorites"
        });
    } catch (error) {
        console.error(error);
        res.status(ResponseStatus.Error).json({ message: "Could not toggle favorite" });
    }
};
