import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import songRoutes from './routes/songRoutes.js';



// Initialize
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route for auth
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes); // ✅ Add this

// Optional: Serve uploaded images/audio (if needed)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error connecting to DB:', error.message);
    process.exit(1);
  }
};

startServer();
