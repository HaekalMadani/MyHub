import { useState, useEffect } from "react";
import Home from "./Home";
import Dashboard from "./Dashboard";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tabID) => {
    setActiveTab(tabID);
  };

  useEffect(() => {
    switch (activeTab) {
      case "home":
        document.title = "MyHub - Home";
        break;
      case "tab1":
        document.title = "MyHub - Dashboard";
        break;
      case "tab2":
        document.title = "MyHub - Schedule";
        break;
      case "tab3":
        document.title = "MyHub - Tasks";
        break;
      default:
        document.title = "MyHub";
    }
  }, [activeTab]);

  return (
    <div>
      {activeTab === "home" && <Home onTabChange={handleTabChange} />}
      {activeTab === "tab1" && (
        <GoogleOAuthProvider clientId="920552388273-3mpplef4rn62argnl485o7bostdvhrgm.apps.googleusercontent.com">
          <Dashboard onTabChange={handleTabChange} />
        </GoogleOAuthProvider>
      )}
    </div>
  );
}

export default App;
