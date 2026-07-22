import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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

// Secure HTTP headers. crossOriginResourcePolicy is relaxed so cross-origin
// clients (the separate frontend) can still consume the API.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

 //CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // cache preflight 24h
  })
);

// Rate limiting: a general cap for the API, and a stricter one for auth to
// blunt brute-force attempts on login/register.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// --- API Routes ---
app.use('/auth', authLimiter, authRoutes);
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