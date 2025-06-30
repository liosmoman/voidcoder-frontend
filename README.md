```markdown
# VoidCoder Frontend

![VoidCoder Screenshot](https://raw.githubusercontent.com/your-github-username/your-frontend-repo/main/public/voidcoder_dashboard_screenshot.png)
*(Note: Replace this URL with a real screenshot URL from your repo later)*

This repository contains the **React frontend** for the VoidCoder application. It provides a modern, responsive user interface for uploading UI screenshots, managing analysis sessions, viewing AI-generated development prompts, and managing user accounts. The UI is built with a "Nimbus AI" inspired theme for a professional and engaging user experience.

## Key Features

*   **Responsive Design:** A clean, modern UI styled with Tailwind CSS that works seamlessly on desktop and mobile devices, featuring a collapsible sidebar.
*   **Multi-Image Upload:** Supports drag-and-drop for uploading multiple UI images in a single session, with the ability to assign titles to each.
*   **Google OAuth 2.0:** Secure and simple user sign-in via Google accounts.
*   **JWT State Management:** Uses React Context API to manage user authentication state globally across the application.
*   **History & Pagination:** A dedicated page for users to view their past analysis sessions, with pagination to handle a large number of entries.
*   **Detailed Results Display:** Features a detailed modal view for history items and a clean display for the final, AI-generated consolidated prompts.
*   **User Feedback:** Includes interactive loading states, toast notifications for actions like copying text, and clear error messaging.

## Tech Stack

*   **Framework:** [React](https://react.dev/) (with Create React App)
*   **Language:** JavaScript (ES6+)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **HTTP Client:** Native Fetch API
*   **Icons:** [Heroicons](https://heroicons.com/)
*   **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## Setup and Installation

### Prerequisites

*   Node.js (v16+) and npm
*   A running instance of the [VoidCoder Backend](https://github.com/your-github-username/voidcoder_backend)

### 1. Clone the Repository

```bash
git clone https://github.com/your-github-username/voidcoder_frontend.git
cd voidcoder_frontend


### 2. Install Dependencies

    npm install

### 3. Set Up Environment Variables    

This project uses environment variables to connect to the backend API.

    1. Create a .env file in the project root:
          
    # For Windows
    copy .env.example .env

    # For macOS/Linux
    cp .env.example .env


    2. Open the .env file and set the URL for your running backend.
      
# .env.example
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1
 

    3. Run the Application
      
    npm start

The React development server will start, and the application will be available at http://localhost:3000.

 Also create the `.env.example` file for the frontend.
1.  Create a file named `.env.example` in the `voidcoder_frontend` root.
2.  Paste the content from the "Set Up Environment Variables" section into it:
    `REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1`
3.  Save the file.