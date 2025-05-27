import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdSchedule,
  MdAssignment,
  MdSettings,
} from 'react-icons/md';
import axios from 'axios';

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { path: "/schedule", label: "Schedule", icon: <MdSchedule /> },
  { path: "/tasks", label: "Tasks", icon: <MdAssignment /> },
  { path: "/settings", label: "Settings", icon: <MdSettings /> },
];

const Sidebar = ({userData}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const hanldleLogout = async () => {
    try {
      await axios.post("https://myhub-tw2f.onrender.com/api/auth/logout", {}, { withCredentials: true });
              navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.response?.data || error.message);
    }

  }


  return (
    <div className="sidebar">
      <div className="logo">
        <h2>MyHub</h2>
      </div>
      <ul className="list">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`list-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <b></b><b></b>
            <a className="list-item-link">
              <span className="icon">{item.icon}</span>
              <span className="title">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="line">
        <span>.</span>
      </div>

      <div className="user-stuff">
        <div className="user-side">
      <img
        src="https://avatar.iran.liara.run/public"
        alt="User avatar"
        className="user-avatar"
        />
      <p className="username"><strong>{userData.name}</strong></p>
      </div>
      <button aria-label="Logout" onClick={hanldleLogout}>
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>Logout</title>
          <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" />
        </svg>
      </button>
      </div>
      

      
    </div>
  );
};

export default Sidebar;
