import express from 'express'
import {getColleges, createCollege, getCollegesByUniversity} from '../controllers/collegeController.js'

const router = express.Router();

// This maps the GET request to /api/colleges to our controller function
router.route('/').get(getColleges).post(createCollege);

router.route('/by-university/:universityId').get(getCollegesByUniversity);

export default router;