import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Song from '../models/Song.js';

const router = express.Router();

// Set up multer storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist } = req.body;
    const audio = req.files.audio[0];
    const cover = req.files.cover[0];

    const newSong = new Song({
      title,
      artist,
      audioPath: audio.filename,
      coverPath: cover.filename
    });

    await newSong.save();
    res.status(200).json({ message: 'Song uploaded successfully' });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching songs' });
  }
});

export default router;
