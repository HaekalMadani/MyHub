import React from 'react';

const Project = () => {
    return (
        <div className="project-container">
            <div className="project-subhead">
                <h2>Projects</h2>
            </div>

            <div className="card-container">
                <div className="add-card">
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <title>add</title>
                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Project;
