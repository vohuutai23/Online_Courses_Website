# Online Courses Website

This MERN Stack project creates an online course website with UML design, project management, iterative development, and security measures like token encryption and password hashing.

## 🚀 Features

- User authentication and authorization
- Course browsing and searching
- Course enrollment and management
- Interactive learning materials
- Progress tracking
- User profiles and settings
- Admin dashboard for course management

## 🛠️ Tech Stack

### Frontend (Client)
- React.js
- Tailwind CSS

### Backend (Server)
- Node.js
- Express.js
- MongoDB/MySQL
- JWT for authentication
- RESTful API architecture

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Git

## 🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/vohuutai23/Online_Courses_Website.git
cd online-courses-website
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Environment Setup
- Create a `.env` file in the server directory
- Add necessary environment variables (see `.env.example`)

4. Start the development servers
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## 📁 Project Structure

```
online-courses-website/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source files
│       ├── components/    # React components
│       ├── pages/        # Page components
│       ├── services/     # API services
│       └── utils/        # Utility functions
│
└── server/                # Backend Node.js application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── models/          # Database models
    ├── routes/          # API routes
    └── middleware/      # Custom middleware
```

## 🔑 Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## 📝 API Documentation

API documentation is available at `/api-docs` when running the server in development mode.

## 📞 Contact

For any questions, suggestions, or support regarding this project, please feel free to reach out:

- **Email:** vohuutai2369@gmail.com
- **GitHub:** https://github.com/vohuutai23
- **LinkedIn:** www.linkedin.com/in/vohuutai23
