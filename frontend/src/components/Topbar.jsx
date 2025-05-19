import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const navigate = useNavigate();

    const hanldleLogout = async () => {
      try {
        await axios.post("http://localhost:4000/api/auth/logout", {}, { withCredentials: true });
                navigate("/login");
      } catch (error) {
        console.error("Error during logout:", error.response?.data || error.message);
      }

    }

  return (
    <div className="topbar">
    

      
      <button aria-label="Logout" onClick={hanldleLogout}>
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Logout</title>
          <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  );
}
