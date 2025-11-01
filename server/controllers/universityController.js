import University from "../models/universityModel.js";

// @desc    Fetch all universities
const getUniversities = async (req, res) => {
  try {
    const universities = await University.find({}).sort({ name: 1 });
    res.json(universities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new university
const createUniversity = async (req, res) => {
  const { name, slug, location } = req.body;
  if (!name || !slug) return res.status(400).json({ message: 'Name and slug required' });
  
  const universityExists = await University.findOne({ slug });
  if (universityExists) return res.status(400).json({ message: 'Slug already exists' });
  
  const university = await University.create({ name, slug, location });
  res.status(201).json(university);
};

export  { getUniversities, createUniversity };