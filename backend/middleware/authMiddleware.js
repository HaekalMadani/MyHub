const { getUserFromToken } = require('../services/authService.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken;

    if(!token){
        return res.status(401).json({success: false, message: "Token Not Provided"})
    }

    try {
        const result = await getUserFromToken(token);
 
        if(result.success) {
            req.user = result.data;
            next();
        }else{
            console.warn("Invalid token:", result.message);
            res.clearCookie('authToken');

            return res.status(401).json({ success: false, message: result.message || "Authentication failed: Invalid token." })
        }
    } catch (error) {
        console.error("Error in auth middleware:", error);

        res.clearCookie('authToken');
        return res.status(500).json({ success: false, message: "Internal server error during authentication" });
    }
}


const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
}

module.exports = {authenticateToken, authMiddleware}