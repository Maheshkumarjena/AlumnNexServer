import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: [String], 
    default: [],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment', // ✅ Correctly references the Comment model
    },
  ],
  shares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true }); // ✅ Enables createdAt & updatedAt automatically

// ✅ Adding an index for faster queries
postSchema.index({ userId: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
