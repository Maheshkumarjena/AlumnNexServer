import mongoose from 'mongoose';

const followerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followedAt: {
    type: Date,
    default: Date.now,
  },
});

const Follower = mongoose.model('Follower', followerSchema);
export default Follower;
