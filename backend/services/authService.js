import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';
import jwt from 'jsonwebtoken'

const JWT_SECRET = "ETRHSDFW43EQT7HDFA";

const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'Strict',
    path: '/',
}

export const registerUser = async(user)=>{
    console.log(user)

    try {
        const hashedPassword =await bcrypt.hash(user.password, 10)
        const query=`INSERT INTO users (name, email, password) VALUES (?,?,?)`
        const values = [user.username, user.email, hashedPassword]

        await pool.query(query, values);
        return {success:true, message: "User Registered Succesfully"}
    } catch (error) {
        return {success:false, message: "User Registered Failed, auth serv", error: error}
    }
}

export const loginUser=async(email, password, res, keepLoggedIn = false) => {
    try {
        const [rows] = await pool.query(`Select * from users where email=?`, [email])
        if(rows.length === 0){
            return {success:false, message: "User Not Found"}
        }
        const user = rows[0]
        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            return{success:false, message:"Invalid Password"}
        }

        const jwtexpiresIn = keepLoggedIn ? '7d' : '1h';
        const cookieMaxAge = keepLoggedIn ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

        const token=jwt.sign(
            {id: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: jwtexpiresIn} 
        )

        res.cookie('authToken', token, {
            ...baseCookieOptions,
            maxAge: cookieMaxAge 
        })

        return{
            success:true,
            message: "Login Successful",
        }
    } catch (error) {
        console.error("Login error:", error);
        return {success:false, message: "Login Failed", error: error}
    }
}

export const getUserFromToken= async(token)=>{
    try{
        const trimmedToken = token.trim();
        const decodedToken=jwt.verify(trimmedToken, JWT_SECRET);

        const [rows] = await pool.query(`Select id,name,email from users where email=?`, [decodedToken.email]);
        if(rows.length === 0){
            return {success:false, message: "User Not Found"}
        }
        return {success:true, data: rows[0]}
    }catch(error){
        return {success:false, message: "Invalid Token", error: error}
    }
}

export const logoutUser=async(res)=>{
    res.clearCookie('authToken', {
        ...baseCookieOptions,
        maxAge: 0,
    })
    return {success:true, message: "Logout Successful"}
}