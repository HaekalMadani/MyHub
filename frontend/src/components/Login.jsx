import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password); // Debugging line

    try {
      const response = await axios.post("http://localhost:4000/api/auth/login-user", { email, password, keepLoggedIn });

      if (response.data.success) {
        toast.success(response.data.message || "Login Successful");
        /*
        const token = response.data.token;
        sessionStorage.setItem("authToken", token);
        localStorage.setItem("authToken", token);
        localStorage.setItem("KeepLoggedIn", JSON.stringify(true));
        */

        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login Failed");
      }
    } catch (error) {
      console.error("Error During Login:", error.response?.data);
      toast.error(error.response?.data?.message || "Something Went Wrong @ login frnt");
    }
  };

  return (
    <div className="home-container">
      <div className="bg-container">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="login-username">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Username or Email..."
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password..."
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="login-keep-logged-in">
            <input 
            type="checkbox" 
            id="keepLoggedIn" 
            checked={keepLoggedIn} onChange={(e)=> setKeepLoggedIn(e.target.checked)} 
            />
            <label htmlFor="keepLoggedIn">Keep me logged in?</label>
          </div>

          <button type="submit" className="submit-login">
            Login
          </button>
          <p>First time?</p>
          <button type="button" onClick={() => navigate("/signup")}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
