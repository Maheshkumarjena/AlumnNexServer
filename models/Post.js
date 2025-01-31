import mongoose from 'mongoose';
import Media from './Media.js';
import User from './User.js';

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
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
