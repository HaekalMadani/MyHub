import UserModel from "../models/userModel.js";
import { registerUser, loginUser, getUserFromToken, logoutUser } from "../services/authService.js";

export const register = async(req, res )=>{
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

export const login=async(req, res) => {
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

/*
export const getUserDetails= async(req, res)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({success: false, message: "Token Not Provided"})
    }

    try {
        const response=await getUserFromToken(token);
        if(response.success===true){    
            return res.status(200).json(response)
        }else{
            return res.status(400).json(response)
        }
    } catch (error) {
        return { success: false, message: "Failed To Receive Data" };
    }
}
*/

export const logout=(req, res)=>{
    try {
        const response= logoutUser(res);
        return res.status(200).json({ success: true, message: response.message });
    } catch (error) {
        console.error("Caught unexpected error in logout controller:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred during logout" });
    }
}

export const getMe = (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, data: req.user });
    }else{
        return res.status(401).json({ success: false, message: "User not found" });
    }
}