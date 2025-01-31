import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Media = mongoose.model('Media', mediaSchema);
export default Media;
