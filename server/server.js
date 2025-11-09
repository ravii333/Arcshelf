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

 //CORS configuration 
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // cache preflight 24h
  })
);

// --- API Routes ---
app.use('/auth', authRoutes);
app.use('/questions', questionRoutes);
app.use('/colleges', collegeRoutes);
app.use('/universities', universityRoutes);
app.use("/pdf", pdfRoutes);

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