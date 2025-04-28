import { useState } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import Project from "./Project"
import Todo from "./Todo"

export default function Dashboard(){
    const [activeDashTab, setActiveDashTab] = useState('projectTab');

    return(
        <div className="container">
            <Sidebar />
            <Topbar />
            <div className="subheader">
                <p>Dashboard</p>
            </div>
            <div className="dashboard-container">
                <div className="dashtab-container">
                    <div 
                    className={`dashtab ${activeDashTab === 'projectTab' ? 'active' : ''}`} 
                    id="projectTab"
                    onClick={() => setActiveDashTab('projectTab')}>
                        <p>Project</p>
                    </div>
                    <div
                     className={`dashtab ${activeDashTab === 'todoTab' ? 'active' : ''}`} 
                     id="todoTab"
                     onClick={() => setActiveDashTab('todoTab')}>
                        <p>To-Do</p>
                    </div>
                </div>
                <div className="content">
                        {activeDashTab === "projectTab" && <Project />}
                        {activeDashTab === "todoTab" && <Todo />}
                </div>

            </div>
        </div>
        
    )
}