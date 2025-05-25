import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useRef } from 'react';
import  api  from '../api.js';
import { FaRegEdit } from "react-icons/fa";

const Project = () => {
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [saveChange, setSaveChange] = useState(false);

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectTag, setProjectTag] = useState('Web Development');
    const [projectStatus, setProjectStatus] = useState('In Development'); 
    const [projectLinks, setProjectLinks] = useState('');

    const [deleteProjectId, setDeleteProjectId] = useState('');

    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editedDescription, setEditedDescription] = useState('')
    const [showTechInput, setShowTechInput] = useState(false);
    const [newTech, setNewTech] = useState('');
    const [showRoadmapInput, setShowRoadmapInput] = useState(false)
    const [newRoadmap, setNewRoadmap] = useState('');

    const [imageURL, setImageURL] = useState('');

    const dialogRef = useRef(null);
    const deleteDialogRef = useRef(null);
    const detailDialogRef = useRef(null);

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

    const openProjectDetails = (project) => {
    setSelectedProject(project);
    detailDialogRef.current?.showModal();
    };

    useEffect(() => {
        setIsLoading(true);


        api.get('/projects')
            .then(res => {
                if (res.data && res.data.success && Array.isArray(res.data.data)) {
                    setProject(res.data.data);
                } else if (res.data && res.data.success && res.data.data === null) {
                    setProject([]);
                } else {
                    console.error('API request was not successful or data format is incorrect:', res.data);
                    setProject([]);
                }
            })
            .catch(err => {
                console.error('Error fetching project data:', err);
                setProject([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <p>Loading projects...</p>;
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
            <dialog ref={detailDialogRef} className="project-details-dialog">
                {selectedProject && (
                <form >
                <div className="project-details-content">
                    <div className="project-detail-title">
                        <p>{selectedProject.project_name}</p>
                    </div>
                    
                    <div className="project-detail-tag">
                        {selectedProject.project_tag.split(',').map((tag, index) => (
                                        <span key={index} className='project-tag'>{tag.trim()}</span>))}
                    </div>

                    <div className="project-detail-desc">
                        {isEditingDesc ? (
                            <div className="desc-edit-container">
                                <textarea 
                                value={editedDescription} 
                                onChange={(e) => setEditedDescription(e.target.value)}
                                rows={4}
                                className='edit-description-textarea'/>

                                <div className="edit-desc-btns">
                                    <button
                                    type='button'
                                    onClick={async ()=> {
                                        try{
                                            api.put(`/projects/${selectedProject.project_id}/description`, {
                                            description: editedDescription,
                                            });

                                            selectedProject.project_description = editedDescription;
                                            setIsEditingDesc(false);
                                            setSaveChange(true)
                                        }catch(err){
                                            console.error('Error updating description:', err)
                                        }
                                    }}>
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setIsEditingDesc(false)}>Cancel</button>
                                </div>
                            </div>
                        ):(
                            <div className="">
                                <p>{selectedProject.project_description || "No description yet."}</p>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setEditedDescription(selectedProject.project_description || '');
                                        setIsEditingDesc(true);
                                    }}>
                                        edit
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="project-detail-techstack">
                        <label>Tech Stack:</label>

                        {Array.isArray(selectedProject.tech_stack) && selectedProject.tech_stack.length > 0 ? (
                            <ul className="tech-stack-list">
                            {selectedProject.tech_stack.map((tech, index) => (
                                <li key={index}>
                                {tech}
                                <button
                                    type="button"
                                    className="remove-tech-btn"
                                    onClick = {async () => {
                                        const updatedStack = selectedProject.tech_stack.filter((_, i) => i !== index);
                                        try{
                                            await api.put(`/projects/${selectedProject.project_id}/techstack`, {
                                                newStack: updatedStack,
                                            });

                                            setSaveChange(true)
                                            setSelectedProject(prev => ({
                                                ...prev,
                                                tech_stack: updatedStack,
                                            }));
                                        }catch(error){
                                            console.error('Error removing tech:', error);
                                            toast.error("Failed to update tech stack.");
                                        }
                                    }}
                                >
                                    ✕
                                </button>
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <p className="tech-stack-placeholder">No tech stack added yet.</p>
                        )}

                        {/* Toggle input field */}
                        {showTechInput ? (
                            <div className="tech-input-wrapper">
                            <input
                                type="text"
                                placeholder="Add a technology"
                                value={newTech}
                                onChange={(e) => setNewTech(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={async() => {
                                    const updatedStack = [...(selectedProject.tech_stack || []), newTech]
                                    try{
                                        const res = await api.put(`/projects/${selectedProject.project_id}/techstack`, {newStack: updatedStack}
                                        );

                                        if(res.data.success){
                                            setSelectedProject(prev => ({
                                            ...prev,
                                            tech_stack: updatedStack
                                            }))
                                            setNewTech('')
                                            setSaveChange(true)
                                        

                                        }else{
                                            toast.error("Update failed.");
                                        }
                                    }catch(err){
                                        console.error('Error adding tech:', err);
                                         toast.error("Failed to update tech stack.");
                                    }
                                    
                                }}
                            >
                                Save
                            </button>
                            <button type="button" onClick={() => {
                                setShowTechInput(false)}}>Cancel</button>
                            </div>
                        ) : (
                            <button type="button" className="add-tech-btn" onClick={() => setShowTechInput(true)}>
                            + Add Tech
                            </button>
                        )}
                    </div>
                    
                    <div className="project-detail-roadmap">
                        <label>Roadmap:</label>
                        {Array.isArray(selectedProject.roadmap) && selectedProject.roadmap.length > 0 ? (
                            <ul className='roadmap-list'>
                            {selectedProject.roadmap.map((road, index) => (
                                <li key={index}>
                                <input type="checkbox" />
                                {road}
                                <button
                                    type='button'
                                    className='remove-tech-btn'
                                    onClick={async() => {
                                        const updatedStack = selectedProject.roadmap.filter((_, i) => i !== index);
                                        try{
                                            await api.put(`/projects/${selectedProject.project_id}/roadmap`, {
                                                roadmap: updatedStack,
                                            })

                                            setSaveChange(true)
                                            setSelectedProject(prev => ({
                                                ...prev,
                                                roadmap: updatedStack
                                            }))
                                        }catch(err){
                                            console.error('Error removing roadmap:', err)
                                            toast.error("Failed to update roadmap.");
                                        }
                                    }}
                                >
                                    ✕
                                </button>
                                </li>
                            ))}

                            </ul>
                        ) : 
                        (
                            <p className="tech-stack-placeholder">No roadmap added yet.</p>
                        )}
                        
                        
                        {showRoadmapInput ? (
                            <div className="tech-input-wrapper">
                            <input
                                type="text"
                                placeholder="Add a technology"
                                value={newRoadmap}
                                onChange={(e) => setNewRoadmap(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={async() => {
                                    const updatedStack = [...(selectedProject.roadmap || []), newRoadmap]
                                    try{
                                        const res = await api.put(`/projects/${selectedProject.project_id}/roadmap`, {roadmap: updatedStack}
                                        );

                                        if(res.data.success){
                                            setSelectedProject(prev => ({
                                            ...prev,
                                            roadmap: updatedStack
                                            }))
                                            setNewRoadmap('')
                                            setSaveChange(true)
                                        

                                        }else{
                                            toast.error("Update failed.");
                                        }
                                    }catch(err){
                                        console.error('Error adding roadmap:', err);
                                         toast.error("Failed to update roadmap.");
                                    }
                                    
                                }}
                            >
                                Save
                            </button>
                            <button type="button" onClick={() => {
                                setShowRoadmapInput(false)}}>Cancel</button>
                            </div>
                        ) : (
                            <button type="button" className="add-tech-btn" onClick={() => setShowRoadmapInput(true)}>
                            + Add Tech
                            </button>
                        )}

                    </div>

                    <div className="project-detail-image">
                        <label>Image URL:</label>
                        <input
                        type="text"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                        placeholder="Paste an image link"
                    />
                    </div>
                    
                    {imageURL && <img src={imageURL} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />}
                </div>
                <div className="button-cont">
                    {saveChange ? (
                        <button type="button" className='close-project' onClick={() => location.reload()}>Save Changes</button>
                    ) : (
                        <button type="button" className='close-project' onClick={() => detailDialogRef.current.close()}>Close</button>
                    )}
                    
                    </div>
                </form>
                )}
                
            </dialog>


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
                        <option value="">------</option>
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
                            <div className="project-cards" key={proj.project_id} onClick={() => openProjectDetails(proj)}>
                                <div className="title-background">
                                <p>{proj.project_name}</p>
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
                                <div className="project-buttons">
                                    <button>
                                        <FaRegEdit className="icon-tertiary" />
                                    </button>
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
