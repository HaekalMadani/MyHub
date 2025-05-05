import { getUserFromToken } from '../services/authService.js';

export const authMiddleware = async (req, res, next) => {
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
