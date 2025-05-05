import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="logo">
        <h2 id="myhub">MyHub</h2>
      </div>

      <div className="menu">
        <ul>
          <li>
            <a onClick={() => navigate("/")} className={isActive("/") ? "active" : ""}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,3L2,12H5V20H19V12H22L12,3Z" />
              </svg>
              Home
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/dashboard")} className={isActive("/dashboard") ? "active" : ""}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              Dashboard
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/schedule")} className={isActive("/schedule") ? "active" : ""}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 3H5A2 2 0 0 0 3 5V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V5A2 2 0 0 0 19 3M12 17V15H8V12H12V10L16 13.5L12 17Z" />
              </svg>
              Schedule
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/tasks")} className={isActive("/tasks") ? "active" : ""}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2C17.5 2 22 6.5 22 12C22 13.3 21.7 14.6 21.3 15.8L19.7 14.2C19.9 13.6 20 12.8 20 12C20 7.6 16.4 4 12 4S4 7.6 4 12S7.6 20 12 20C12.8 20 13.6 19.9 14.2 19.7L15.8 21.3C14.6 21.7 13.3 22 12 22Z" />
              </svg>
              Tasks
            </a>
          </li>
        </ul>
      </div>

      <div className="empty"></div>

      <div className="menu2">
        <ul>
          <li>
            <a onClick={() => navigate("/settings")} className={isActive("/settings") ? "active" : ""}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,15.5A3.5,3.5 0 1,1 15.5,12A3.5,3.5 0 0,1 12,15.5M21.54,14.63L19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37L19.66,5.27L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42H9.5L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.34,5.27L2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63L4.34,18.73L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58H14.5L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.66,18.73L21.54,14.63Z" />
              </svg>
              Settings
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
