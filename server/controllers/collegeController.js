import College from "../models/collegeModel.js";

// @desc    Create a new college
// @route   POST /api/colleges
// @access  Private (in the future, maybe Admin only)
const createCollege = async (req, res) => {
  const { name, slug, location, university } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: 'Name and slug are required' });
  }

  if (!university) {
      return res.status(400).json({ message: 'University ID is required.' });
  }

  const collegeExists = await College.findOne({ slug });

  if (collegeExists) {
    return res.status(400).json({ message: 'College with this slug already exists' });
  }

  const college = await College.create({
    name,
    slug,
    location,
    university,
  });

  if (college) {
    res.status(201).json(college);
    console.log(college)
  } else {
    res.status(400).json({ message: 'Invalid college data' });
  }
};

// @desc    Fetch all colleges
// @route   GET /api/colleges
// @access  Public
const getColleges = async (req, res) => {
  try {
    const colleges = await College.find({}).populate('university', 'name'); // Find all college documents
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch colleges for a specific university
// @route   GET /api/colleges/by-university/:universityId
const getCollegesByUniversity = async (req, res) => {
    try {
        // CHANGE THIS (it's fetching ALL colleges):
        // const colleges = await College.find({}).sort({ name: 1 }).populate('university', 'name');
        
        // TO THIS (it finds colleges for the specific university):
        const colleges = await College.find({ university: req.params.universityId })
                                      .sort({ name: 1 })
                                      .populate('university', 'name');
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export {getColleges, createCollege, getCollegesByUniversity} ;