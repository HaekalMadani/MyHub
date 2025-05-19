import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useRef } from 'react';

const Project = () => {
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectTag, setProjectTag] = useState('Web Development');
    const [projectStatus, setProjectStatus] = useState('In Development'); 
    const [projectLinks, setProjectLinks] = useState('');

    const [deleteProjectId, setDeleteProjectId] = useState('');

    const dialogRef = useRef(null);
    const deleteDialogRef = useRef(null);

    const toggleAddProject = () => {
    if (dialogRef.current) {
    if (dialogRef.current.open) {
      dialogRef.current.close();
    } else {
      dialogRef.current.showModal();
    }
  }
}

    const toggleDeleteProject = () => {
        if(deleteDialogRef.current){
            if(deleteDialogRef.current.open) {
                deleteDialogRef.current.close();
            }else {
                deleteDialogRef.current.showModal();
            }
        }
    }

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        axios.get('http://localhost:4000/api/projects', 
             { withCredentials: true })
            .then(res => {
                if (res.data && res.data.success && Array.isArray(res.data.data)) {
                    setProject(res.data.data);
                } else if (res.data && res.data.success && res.data.data === null) {
                    setProject([]);
                } else {
                    console.error('API request was not successful or data format is incorrect:', res.data);
                    setError('Failed to fetch projects or data is in an unexpected format.');
                    setProject([]);
                }
            })
            .catch(err => {
                console.error('Error fetching project data:', err);
                setError(err.message || 'An unknown error occurred.');
                setProject([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <p>Loading projects...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleAddProject = async(e) => {
        e.preventDefault();

        try{
            const response = await axios.post('http://localhost:4000/api/projects',
            {
                projectName: projectName,
                projectDescription: projectDescription,
                projectTag: projectTag,
                projectStatus: projectStatus,
                projectLinks: projectLinks
            }, 
             {withCredentials: true});

            if(response.data && response.data.success){
                toast.success(response.data.message || "Added Project Successfully");

                setProjectName('');
                setProjectDescription('');
                setProjectTag('');
                setProjectStatus('');
                setProjectLinks('');

      
                dialogRef.current?.close();
                location.reload()

            }else{
                toast.error(response.data.message || "Failed to add project");
            }

        }catch(err){
            console.error('Error adding project:', err);
            setError(err.message || 'An unknown error occurred.');
        }
    }

    const handleDeleteProject = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.delete('http://localhost:4000/api/projects/delete/' + deleteProjectId, {withCredentials: true} )

            if(response.data && response.data.success){
                toast.success(response.data.message || "Removed Project")

                location.reload()
            }
        }catch(error){
            console.log('Failed to delete project', error)
        }
        
    }

    return (
        <div className="project-container">

            <dialog ref={dialogRef} className="add-project-dialog"> 
                <form onSubmit={handleAddProject}>
                    <h2>Add Project</h2>
                    <div className="project-name-cont">
                       <label htmlFor="projectName">Project Name:</label>
                    <input
                      type="text"
                      placeholder='Add Project Name....'
                      onChange={(e) => setProjectName(e.target.value)}/> 
                    </div>
                    
                    <div className="project-description-cont">
                        <label htmlFor="projectDescription">Project Description:</label>
                    <input
                      type="text"
                      placeholder='Add Project Description....'
                      onChange={(e) => setProjectDescription(e.target.value)}/>
                    </div>
                   
                   <div className="project-tag-cont">
                        <label htmlFor="projectTag">Project Tag:</label>
                        <select
                        onChange={(e) => setProjectTag(e.target.value)}>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Machine Learning">Machine Learning</option>
                        </select>
                   </div>
                    
                    <div className="project-status-cont">
                        <label htmlFor="projectStatus">Project Status:</label>
                        <select
                        onChange={(e) => setProjectStatus(e.target.value)}>
                            <option value="In Development">In Development</option>
                            <option value="Finished">Finished</option>
                        </select>
                    </div>

                    <div className="project-links-cont">
                        <label htmlFor="projectLinks">Project Links:</label>
                        <input
                        type="text"
                        placeholder='Add Project Links....'
                        onChange={(e) => setProjectLinks(e.target.value)}/>
                    </div>
                    <div className="button-cont">
                        <button type="submit" className="submit-project-btn">Submit</button> 
                        <button type="button" onClick={() => dialogRef.current.close()}>Close</button>                
                    </div>
                    
                </form>
            </dialog>

            <dialog ref={deleteDialogRef} className='add-project-dialog'>
                <form onSubmit={handleDeleteProject}>
                    <select 
                    onChange={(e) => setDeleteProjectId(e.target.value)}>
                      {project && project.length > 0 ? (
                        project.map((proj) => (
                            <option value={proj.project_id}>
                                {proj.project_name}
                            </option>
                        ))
                    ) : (
                        <p>No Project Listed!</p>
                    )}  
                    </select>
                        <div className="button-cont">
                        <button type="submit" className="submit-project-btn">Delete</button> 
                        <button type="button" onClick={() => deleteDialogRef.current.close()}>Close</button>                
                    </div>

                </form>

            </dialog>

            <div className="project-subhead">
                <h2>Projects</h2>
                <div className="button-group">
                    <button onClick={toggleAddProject} className='add-project-btn'> Add Project </button>
                    <button onClick={toggleDeleteProject} className='add-project-btn'> Delete Project </button>
                </div>

            </div>

            <div className="card-container">
                {project && project.length > 0 ? (
                        project.map((proj) => (
                            <div className="project-cards" key={proj.project_id}>
                                <div className="title-background">
                                <h1>{proj.project_name}</h1>
                                </div>
                                <div className="project-details">
                                    <p className='project-desc'>{proj.project_description}</p>
                                <p className='project-status'>{proj.project_status}</p>
                                <div className='tag-container'>
                                    {proj.project_tag.split(',').map((tag, index) => (
                                        <span key={index} className='project-tag'>{tag.trim()}</span>
                                    ))}
                                </div>
                                </div>
                                
                            </div>
                        ))
                    ) : (
                        <p>No projects found.</p>
                    )}
            </div>
        </div>
    );
}

export default Project;
