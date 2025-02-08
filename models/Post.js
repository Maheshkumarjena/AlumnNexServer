import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Add reference to the User model
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
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;