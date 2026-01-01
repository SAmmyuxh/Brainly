import mongoose, { Types } from "mongoose";
const contentTypes = ['image', 'video', 'article', 'audio', 'document', 'link', 'youtube', 'x', 'note'];
const ContentSchema = new mongoose.Schema({
  link: { type: String, required: false }, // Optional for notes
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String }, // Rich text content for notes
  tags: [String],
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  folderId: { type: Types.ObjectId, ref: 'Folder' }, // Optional folder association
  thumbnail: { type: String },
  isFavorite: { type: Boolean, default: false }
}, { timestamps: true })

// Text index for full-text search with weighted fields
ContentSchema.index(
  { title: 'text', description: 'text', tags: 'text', content: 'text' },
  { weights: { title: 10, tags: 5, description: 3, content: 1 } }
);

export default mongoose.model('Content', ContentSchema)