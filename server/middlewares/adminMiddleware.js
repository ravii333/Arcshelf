import User from "../models/userModel.js";

// Must run AFTER authMiddleware (which sets req.userId).
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authorization check failed." });
  }
};

export default adminMiddleware;
