import mongoose, { Types } from "mongoose";

const FolderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String, default: "#8B5CF6" }, // Default purple
    icon: { type: String, default: "folder" },
    userId: { type: Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Compound index for unique folder names per user
FolderSchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model('Folder', FolderSchema);
