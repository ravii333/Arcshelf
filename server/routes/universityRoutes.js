import express from'express'

const router = express.Router();
import { getUniversities, createUniversity } from '../controllers/universityController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

// GET is public (used by the submit form and sidebar).
// Creating a university requires a logged-in user, matching the client's ProtectedRoute guard.
router.route('/').get(getUniversities).post(authMiddleware, createUniversity);

export  default router;