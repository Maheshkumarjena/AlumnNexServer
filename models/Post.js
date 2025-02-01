import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Must be a valid ObjectId
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  media: {
    type: [String], // Array of strings (URLs)
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;