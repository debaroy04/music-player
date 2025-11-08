import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  audioPath: { type: String, required: true },
  coverPath: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Song', songSchema);
