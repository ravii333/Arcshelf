import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. No token provided.' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
  }
};

export default authMiddleware;