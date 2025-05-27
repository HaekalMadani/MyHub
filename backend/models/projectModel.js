class projectModel {
    constructor(user) {
        this.projectName =  user.projectName;
        this.projectDescription = user.projectDescription;
        this.projectTag = user.projectTag;
        this.projectStatus = user.projectStatus;
        this.projectFiles = user.projectFiles;
        this.projectLinks = user.projectLinks;
    }
}

module.exports = projectModel;