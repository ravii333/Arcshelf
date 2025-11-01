import express from'express'

const router = express.Router();
import { getUniversities, createUniversity } from '../controllers/universityController.js';

router.route('/').get(getUniversities).post(createUniversity);

export  default router;