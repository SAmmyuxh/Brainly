import e from "express";
import { checkLinkController, deletecontroller, getcontentcontroller, linkcontroller, newcontentcontroller, sharecontroller, updateContentController, getTagsController } from "../Controller/ContentController";
import { chatController, generateMetadataController } from "../Controller/ChatController";
import { createFolderController, deleteFolderController, getFoldersController, moveToFolderController, toggleFavoriteController, updateFolderController } from "../Controller/FolderController";
import { getAnalyticsController } from "../Controller/AnalyticsController";
import { addToReviewController, getDueReviewsController, getReviewStatsController, removeFromReviewController, submitReviewController } from "../Controller/ReviewController";
import { usermiddleware } from "../Middlewares/middleware";
import { aiLimiter, generalLimiter } from "../Middlewares/rateLimiter";

const router = e.Router()

// Content routes
router.post('/content', usermiddleware, newcontentcontroller)
router.get('/content', usermiddleware, getcontentcontroller)
router.delete('/content', usermiddleware, deletecontroller)
router.put('/content', usermiddleware, updateContentController)
router.get('/tags', usermiddleware, getTagsController)

// Folder routes
router.post('/folders', usermiddleware, createFolderController)
router.get('/folders', usermiddleware, getFoldersController)
router.put('/folders', usermiddleware, updateFolderController)
router.delete('/folders', usermiddleware, deleteFolderController)
router.post('/folders/move', usermiddleware, moveToFolderController)
router.post('/content/favorite', usermiddleware, toggleFavoriteController)
router.post('/content/check-link', usermiddleware, checkLinkController)

// Review/Memory Vault routes
router.post('/reviews', usermiddleware, addToReviewController)
router.get('/reviews', usermiddleware, getDueReviewsController)
router.post('/reviews/submit', usermiddleware, submitReviewController)
router.get('/reviews/stats', usermiddleware, getReviewStatsController)
router.delete('/reviews', usermiddleware, removeFromReviewController)

// Analytics route
router.get('/analytics', usermiddleware, getAnalyticsController)

// Brain/Share routes
router.post('/brain/share', usermiddleware, sharecontroller)
router.post('/brain/chat', usermiddleware, aiLimiter, chatController)
router.post('/brain/metadata', usermiddleware, aiLimiter, generateMetadataController)
router.get('/brain/:shareLink', generalLimiter, linkcontroller)

export default router