import React from 'react';

const Sidebar = ({ onTabChange, activeTab }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2 id="myhub">MyHub</h2>
      </div>
      
      <div className="menu">
        <ul>
          <li>
            <a href="">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75M12,15C13.5,15 16.5,15.75 16.5,17.25V18H7.5V17.25C7.5,15.75 10.5,15 12,15Z"/>
              </svg>
              Home
            </a>
          </li>
          <li>
            <a href="#" className={`tab ${activeTab === 'tab1' ? 'active' : ''}`} id="tab1" onClick={() => onTabChange('tab1')}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>account</title>
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className={`tab ${activeTab === 'tab2' ? 'active' : ''}`} id="tab2" onClick={() => onTabChange('tab2')}>
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>calendar-arrow-right</title>
                <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M19 19H5V8H19V19M12 17V15H8V12H12V10L16 13.5L12 17Z" />
              </svg>
              Schedule
            </a>
          </li>
          <li>
            <a href="#">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>checkbox-marked-circle-auto-outline</title>
                <path d="M12 22C12.8 22 13.6 21.9 14.3 21.7C13.9 21.2 13.5 20.6 13.3 19.9C12.9 20 12.4 20 12 20C7.6 20 4 16.4 4 12C4 7.6 7.6 4 12 4C12.8 4 13.5 4.1 14.2 4.3L15.8 2.7C14.6 2.3 13.3 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22M6.5 11.5L7.9 10.1L11 13.2L19.6 4.6L21 6L11 16L6.5 11.5M19 14L17.74 16.75L15 18L17.74 19.26L19 22L20.25 19.26L23 18L20.25 16.75L19 14Z" />
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
            <a href="#">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>cog</title>
                <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
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