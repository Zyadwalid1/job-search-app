# Job Search Application

A comprehensive job search platform built with Node.js, Express, MongoDB, and Socket.IO. This application connects job seekers with employers, featuring real-time chat, application tracking, and company management.

## Features

### User Management
- User registration and authentication
- Profile management with picture uploads
- Mobile number encryption for privacy
- Role-based access control (Admin, HR, User)

### Company Features
- Company profile creation and management
- Multiple HR management
- Company logo and cover picture handling
- Legal document attachment support

### Job Management
- Job posting and management
- Advanced job search and filtering
- Application tracking system
- Real-time notifications

### Application Process
- Resume upload and management
- Application status tracking
- Email notifications
- Real-time updates

### Chat System
- Real-time chat between HR and applicants
- Chat history tracking
- Notification system
- Message persistence

### Admin Dashboard
- User management (ban/unban)
- Company approval system
- Analytics and reporting
- System monitoring

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Real-time Communication**: Socket.IO
- **File Upload**: Multer, Cloudinary
- **Authentication**: JWT
- **Email Service**: Nodemailer
- **Encryption**: Crypto-js
- **API Documentation**: GraphQL
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Cloudinary account
- Gmail account (for email notifications)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd job_search_app
```

2. Install dependencies
```bash
npm install
```

3. Create .env file in root directory with the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SENDER_EMAIL=your_gmail
SENDER_PASS=your_gmail_app_password
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
CLOUD_APP_FOLDER=your_cloudinary_folder
```

4. Start the application
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Authentication
- POST /auth/register - Register new user
- POST /auth/login - User login
- POST /auth/verify - Email verification
- POST /auth/forgot-password - Password reset

### User Operations
- PATCH /users/update - Update user profile
- POST /users/profile-pic - Upload profile picture
- DELETE /users/profile-pic - Delete profile picture
- GET /users/:userId - Get user profile

### Company Operations
- POST /companies/register - Register new company
- PATCH /companies/:companyId - Update company
- GET /companies/search - Search companies
- POST /companies/logo - Upload company logo

### Job Operations
- POST /jobs - Create new job
- GET /jobs - Get all jobs
- GET /jobs/:jobId - Get specific job
- PATCH /jobs/:jobId - Update job
- DELETE /jobs/:jobId - Delete job

### Application Operations
- POST /jobs/:jobId/apply - Apply for job
- GET /jobs/:jobId/applications - Get job applications
- PATCH /jobs/:jobId/applications/:applicationId/accept - Accept application
- PATCH /jobs/:jobId/applications/:applicationId/reject - Reject application

### Chat Operations
- GET /chat/:userId - Get chat history
- Socket.IO events for real-time messaging

## Socket.IO Events

### Chat Events
- 'join' - Join user's notification room
- 'startChat' - Initiate chat (HR only)
- 'sendMessage' - Send message
- 'newMessage' - Receive new message

## Security Features

- Password hashing
- JWT authentication
- Mobile number encryption
- File type validation
- Rate limiting
- CORS protection
- XSS prevention

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
