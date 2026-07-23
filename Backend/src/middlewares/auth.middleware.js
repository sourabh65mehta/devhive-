import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const authMiddleware = (req, res, next) => {
   try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        throw new ApiError(401, 'No token provided');
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     req.user = decoded;
    next();
   } catch (error) {
    console.error("auth Middleware error",error);
    next(new ApiError(401, 'Invalid or expired token'));
   }
}

export default authMiddleware;

