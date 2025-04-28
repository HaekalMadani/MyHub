import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function Dashboard(){
    return(
        <div className="container">
            <Sidebar />
            <Topbar />
            <div className="subheader">
                <p>Dashboard</p>
            </div>
            <div className="project-container"></div>
        </div>
        
    )
}