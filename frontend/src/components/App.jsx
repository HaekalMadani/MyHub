import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";

function App() {
  

  axios.defaults.baseURL = 'http://localhost:4000/api';
  axios.defaults.withCredentials = true;

  return (
    <GoogleOAuthProvider clientId="920552388273-3mpplef4rn62argnl485o7bostdvhrgm.apps.googleusercontent.com">
      <Router>
        <ToastContainer position="top-center" autoClose={1000} closeOnClick theme="colored" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={ <Dashboard />}
          />
          {/* Optional: Fallback for unknown routes */}
          
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
