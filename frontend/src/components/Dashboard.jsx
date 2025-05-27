import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import Project from "./Project"
import Todo from "./Todo"
import Spending from "./Spending"
import axios from "axios"
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
    const [activeDashTab, setActiveDashTab] = useState('projectTab');
    const [userData, setUserData] = useState("")
    const [loadingUser, setLoadingUser] = useState(true); 

    const navigate = useNavigate();


    useEffect(()=>{fetchUserDetails()}, []);

    const fetchUserDetails = async() =>{
        try {
            //const token = sessionStorage.getItem("authToken");
            const response = await axios.get(
                '/auth/me',
                {
                    withCredentials: true,
                }
            );
            console.log(response); // Debugging line
            if(response.data.success){
                console.log(response.data); // Debugging line

                setUserData(response.data.data)
            }else{
                console.log(response.data.message || "Failed to fetch user details");
            }
        } catch (err) {
            console.error("error fetching data", err);
            if(err.response?.status === 401){
                console.log("Unauthorized access. Please log in again.");
                setUserData(null);

                navigate("/login");
            }
            console.log(err.response?.data?.message || "An error has occured")
        } finally{
            console.log("Fetch user details request completed");
            setLoadingUser(false)
        }
    }

    if(loadingUser){
        return <div> loading.... </div>
    }

    if(!userData){
        return (<div className="fail-container">
            <div className="fail-message-box">
              <p className="fail-message">Failed to load dashboard. Please try logging in again.</p>
              <button className="fail-button" onClick={() => navigate('/')}>
                Go to Home
              </button>
            </div>
          </div>
            
        )
    }

    return(
        <div className="container">
            <Sidebar userData={userData} />
            <Topbar userData={userData}/>
            <div className="dashboard-container">
                <div className="dashtab-container">
                    <div 
                    className={`dashtab ${activeDashTab === 'projectTab' ? 'active' : ''}`} 
                    id="projectTab"
                    onClick={() => setActiveDashTab('projectTab')}>
                        <p>Project</p>
                    </div>
                    
                    {/*<div
                     className={`dashtab ${activeDashTab === 'todoTab' ? 'active' : ''}`} 
                     id="todoTab"
                     onClick={() => setActiveDashTab('todoTab')}>
                        <p>To-Do</p>
                    </div> */}
                    
                    <div
                    className={`dashtab ${activeDashTab === 'spendingTab' ? 'active' : ''}`}
                    id="spendingTab"
                    onClick={() => setActiveDashTab('spendingTab')}
                    >
                        <p>Spending</p>
                    </div>
                </div>
                <div className="content">
                        {activeDashTab === "projectTab" && <Project />}
                        {activeDashTab === "todoTab" && <Todo />}
                        {activeDashTab === "spendingTab" && <Spending />}
                </div>

            </div>
        </div>
        
    )
}