# Garden Decoration Booking Platform

A complete web application for scheduling garden decoration services offered by various companies. The platform is built using the MEAN stack (MongoDB, Express, Angular, Node.js). It allows users to easily select a company and schedule a garden decoration service, with different roles for admin, garden owners (private/restaurant), and decorators.

## Features

- **Dynamic Company Locations on Map**: Displays company locations using **Leaflet** and **Axios**.
- **User Verification**: Includes **ngx-captcha** for ensuring users are not robots when registering a new account.
- **Upload images**: Uses **multer** to upload images to server.
- **Garden Layout Upload**: Allows users to upload garden layouts through a **JSON file** or draw on a **Canvas element**.
- **Statistics & Graphs**: Display various statistical data in charts using **ngx-charts** (swimlane).
- **Elegant User Interface**: Designed with focus on a visually appealing and intuitive frontend.

## User Roles

- **Admin**: Manages companies, employees, and user accounts.
- **Garden Owner** (Private/Restaurant): Can schedule a decoration service by choosing a company and filling out the relevant information.
- **Decorator**: Logs in to see accepted and new decoration jobs. They can accept or decline the jobs. Once the job is completed, the owner can schedule service again in the future.

## Workflow

1. **Scheduling**: Garden owners select a company and submit the required details for a garden decoration.
2. **Job Acceptance**: Decorators log in to their accounts, view pending jobs, and accept or decline them.
3. **Job Completion**: After the job is completed, the garden owner can request follow-up services in the future.
4. **Statistics**: All employees can view company statistics.

## Setup Instructions

1. Clone the repository.
2. Install dependencies for both the frontend and backend.
3. Run the backend and frontend servers as specified in the documentation.
