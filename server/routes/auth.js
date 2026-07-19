import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (user) =>
  jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword, name: name.trim() });

    // Auto-login: return a token so the client doesn't need a second login step.
    const token = signToken(user);
    res.status(201).json({ result: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = signToken(user);
    res.status(200).json({ result: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during login.' });
  }
});

// PATCH /api/auth/update-profile - update user profile
router.patch('/update-profile', authMiddleware, async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (password && password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    if (name) user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await user.save();

    // Generate new token
    const token = signToken(updatedUser);

    res.status(200).json({ result: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during profile update.' });
  }
});

export default router;