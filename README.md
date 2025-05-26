# MyHub
MyHub is a full-stack web application dashboard designed for everyday productivity and organization. It integrates essential tools like project tracking and personal finance monitoring into one centralized platform.



## Deployment:
Live Link: Coming Soon

## Features:
- Project display: Showcase and manage your ongoing personal.
- Spending Tab: Automatically tracks your monthly expenses using Gmail integration.

## To be Implemented
- Enhance project management (tags, filter, media uploads)
- Manual expense tracking support and Customizable Gmail fetch filters
- To-Do list and task manager
- Customizable user profiles (avatars, bios, themes)

## Tech Stack:
- Frontend: React Vite
- Backend: Node.js with Express.js
  - MVC architecture
- Database: MySQL
- Authentication:
  - JWT-based authentication using HTTP-only cookies
  - Google OAuth 2.0
- Integrations:
  - Google's GMAIL API (for fetching bank transaction email)
- API Handling:
  - Axios
 
## To run locally:
After downloading both frontend and backend folders:

⚠️ Make sure Node.js and its package manager (npm) is installed
```bash
# Frontend/backend Libraries install (make sure to do in both backend/frontend folders)
npm install
```
- Run Frontend:
```bash
npm run dev
```
- Run Backend:
```bash
node server.js
```

Database Setup:

## Screenshots:
![alt text](https://github.com/HaekalMadani/MyHub/blob/main/img/ProjectDash.png?raw=true)

![at text](https://github.com/HaekalMadani/MyHub/blob/main/img/SpendingDash.png?raw=true)



