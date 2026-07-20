import express from 'express'
import {getColleges, createCollege, getCollegesByUniversity} from '../controllers/collegeController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router();

// GET is public (used by the submit form, sidebar, and browse).
// Creating a college requires a logged-in user, matching the client's ProtectedRoute guard.
router.route('/').get(getColleges).post(authMiddleware, createCollege);

router.route('/by-university/:universityId').get(getCollegesByUniversity);

export default router;