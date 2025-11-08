import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import collegeRoutes from './routes/collegeRoutes.js'
import connectDB from './config/db.js';
import universityRoutes from './routes/universityRoutes.js'
import pdfRoutes from './routes/pdfRoutes.js'

dotenv.config();

connectDB();

const app = express();
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/universities', universityRoutes);
app.use("/api/pdf", pdfRoutes);

app.get('/', (req, res) => {
  res.send('ArcShelf API is running!');
});

// --- Connect to MongoDB & Start Server ---
const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
//   .catch((error) => console.error(`${error} did not connect`));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);