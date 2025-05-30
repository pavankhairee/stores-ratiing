Getting Started
Prerequisites
Make sure you have the following installed on your local machine:

Node.js (v16 or above recommended)

npm or yarn

PostgreSQL database

Installation
Clone the repository

git clone https://github.com/yourusername/yourproject.git
cd yourproject
Backend Setup

cd backend
npm install

create a congif file or .env
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/yourdatabase
JWT_SECRET=your_jwt_secret

npm run migrate
Start the backend server

npm start
This will start the backend at http://localhost:3000.

Frontend Setup
Open a new terminal window/tab, go to the frontend folder:

cd frontend
npm install
Create a .env file if needed (for API URLs, etc.):

REACT_APP_API_URL=http://localhost:3000
Start the frontend development server:

npm start
This will start the React app at http://localhost:3000 (or usually http://localhost:3001 if 3000 is taken).

Usage
Open the frontend URL in your browser.

Use the login or signup form to authenticate.

Use the search input to find users or stores.

Add users and stores using the respective buttons.

View stats and manage your data easily!
