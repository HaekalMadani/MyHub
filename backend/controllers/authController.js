const UserModel = require("../models/userModel.js");
const {
  registerUser,
  loginUser,
  getUserFromToken,
  logoutUser,
  saveGoogleRefreshToken,
  deleteGoogleRefreshToken,
} = require("../services/authService.js");
const { authenticateToken } = require('../middleware/authMiddleware.js');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config()


const register = async(req, res )=>{
    const {username, email, password, confirmPassword} =req.body;

    if(!username || !email || !password){
        return res.status(400).json({success:false, message: "All fields are required"});
    }

    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user= new UserModel({username, email, password});

    try{
        const response=await registerUser(user);
        if(response.success===true){
            return res.status(201).json(response)
        }else{
            return res.status(400).json(response)
        }
    }catch(error){
        console.error("Caught unexpected error in register controller:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred during registration" });
    }
}

const login=async(req, res) => {
    const {email, password, keepLoggedIn} = req.body;
    if(!email || !password){
        return res.status(400).json({success: false, message: "All fields are required"})
    }

    try {
        const response=await loginUser(email, password, res, keepLoggedIn);
        if(response.success===true){    
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }
    } catch (error) {
        console.error("Login error:", error); 
        return res.status(500).json({ success: false, message: "Internal server error during login" });
    }
}

const logout=(req, res)=>{
    try {
        const response= logoutUser(res);
        return res.status(200).json({ success: true, message: response.message });
    } catch (error) {
        console.error("Caught unexpected error in logout controller:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred during logout" });
    }
}

const getMe = (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, data: req.user });
    }else{
        return res.status(401).json({ success: false, message: "User not found" });
    }
}

// ------ GOOGLE AUTHENTICATION ------

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const redirectToGoogle = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });

  res.redirect(url);
};

const handleGoogleCallback = async(req, res) => {
    const {code} = req.query;
    const token = req.cookies.authToken
    
    if(!token){
        return res.status(401).json({success: false, message: "User Not Authenticated"})
    }

    const userResult = await getUserFromToken(token);
    if(!userResult.success){
        return res.status(401).json({success: false, message: "Invalid user Token for Google Authentication"})
    }

    const userId = userResult.data.id;
    
    try{
        const {tokens} = await oauth2Client.getToken(code);
        if(tokens.refresh_token){
            await saveGoogleRefreshToken(userId, tokens.refresh_token);
        }
        res.redirect("http://localhost:5173/dashboard");
    }catch(error){
        console.error("Error during Google authentication callback:", error);
        return res.status(500).json({success: false, message: "Internal server error during Google authentication"});
    }

};

const unlinkGoogleAccount = async(req, res) => {
    try{
        const response = await deleteGoogleRefreshToken(req.user);
        return res.status(200).json({success: true, message: "Google account unlinked successfully"});
    }catch(error){
        console.error("Error unlinking Google account:", error);
        return res.status(500).json({success: false, message: "Internal server error during unlinking Google account"});
    }
}
  
module.exports = {register, login, logout, getMe, redirectToGoogle, handleGoogleCallback, unlinkGoogleAccount }