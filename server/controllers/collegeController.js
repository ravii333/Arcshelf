import College from "../models/collegeModel.js";

const createCollege = async (req, res) => {
  const { name, slug, location, university } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Name and slug are required" });
  }

  if (!university) {
    return res.status(400).json({ message: "University ID is required." });
  }

  const collegeExists = await College.findOne({ slug });

  if (collegeExists) {
    return res
      .status(400)
      .json({ message: "College with this slug already exists" });
  }

  const college = await College.create({
    name,
    slug,
    location,
    university,
  });

  if (college) {
    res.status(201).json(college);
    console.log(college);
  } else {
    res.status(400).json({ message: "Invalid college data" });
  }
};

const getColleges = async (req, res) => {
  try {
    const colleges = await College.find({}).populate("university", "name"); // Find all college documents
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getCollegesByUniversity = async (req, res) => {
  try {

    const colleges = await College.find({ university: req.params.universityId })
      .sort({ name: 1 })
      .populate("university", "name");
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { getColleges, createCollege, getCollegesByUniversity };
