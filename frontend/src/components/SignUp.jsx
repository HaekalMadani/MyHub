import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(formValues); // Debugging line
    try {
      const response = await axios.post("/auth/register-user",formValues);
      console.log(response)

      if (response.data.success) {
        toast.success(response.data.message || 'Registration successful!');
        setFormValues({username:"",email:"",password:"", confirmPassword:""});

        navigate('/login');
    } else {
        toast.error(response.data.message || 'Registration failed!');
    }
    } catch (error) {
      console.log('Error during Resignation:', error);
      toast.error(error.response.data.error.message ||error.response.data.message || "Something went wrong")
    }


    ;
  };

  return (
    <div className="home-container">
      <div className="bg-container">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
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
          <h1>Sign Up</h1>

          <div className="signup-username">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a Username..."
              value={formValues.username}
              onChange={handleInputChange}
            />
          </div>

          <div className="signup-email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your Email..."
              value={formValues.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="signup-password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a Password..."
              value={formValues.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="signup-confirm-password">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your Password..."
              value={formValues.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <button className="submit-login">Create Account</button>
          <p>Already have an account?</p>
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
