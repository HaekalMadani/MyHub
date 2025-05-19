import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdSchedule,
  MdAssignment,
  MdSettings,
} from 'react-icons/md';

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

      <div className="user-side">
      <img
        src="https://avatar.iran.liara.run/public"
        alt="User avatar"
        className="user-avatar"
        />
        <p className="username"><strong>{userData.name}</strong></p>
      </div>

      
    </div>
  );
};

export default Sidebar;
