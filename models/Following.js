import mongoose from 'mongoose';

const followingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  followedAt: {
    type: Date,
    default: Date.now,
  },
});

const Following = mongoose.model('Following', followingSchema);
export default Following;
