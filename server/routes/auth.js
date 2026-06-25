import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword, name });

    res.status(201).json({ message: 'User created successfully.' });
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

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ result: { id: user._id, name: user.name, email: user.email }, token });
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

    if (name) user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await user.save();
    
    // Generate new token
    const token = jwt.sign({ email: updatedUser.email, id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(200).json({ result: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong during profile update.' });
  }
});

export default router;