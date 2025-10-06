# Vehicle Expense Management System

A comprehensive web application for managing vehicle export expenses between Japan exporters and Sri Lankan users. The system facilitates expense sharing, tracking, and collaboration between exporters and local users.

## 🚀 Features

### For Japan Exporters (ROLE_EXPORTER)
- **Dashboard**: Overview of expenses, statistics, and recent activity
- **Expense Management**: Create, update, and track vehicle-related expenses
- **Expense Sharing**: Share expenses with Sri Lankan users for review and approval
- **Parts Management**: Track vehicle parts inventory
- **Company Profile**: Manage exporter company information and verification documents
- **Statistics**: View expense analytics and category breakdowns

### For Sri Lankan Users (ROLE_LOCAL)
- **Dashboard**: View shared expenses and pending actions
- **Expense Review**: Accept, reject, or request more information on shared expenses
- **Exporter Directory**: Browse verified Japan exporters
- **Notifications**: Real-time updates on expense status changes

### For Administrators (ROLE_ADMIN)
- **User Management**: Manage all users and their roles
- **Exporter Verification**: Verify exporter documents and profiles
- **System Overview**: Monitor all expenses and user activity

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Authentication**: JWT-based authentication with role-based access control
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO for live notifications
- **Security**: Helmet, CORS, rate limiting, input validation
- **Logging**: Winston for comprehensive logging

### Frontend (React + Vite)
- **State Management**: Redux Toolkit for global state
- **Routing**: React Router for navigation
- **UI Components**: Custom components with Tailwind CSS
- **Forms**: React Hook Form for form management
- **Real-time**: Socket.IO client for live updates

## 📁 Project Structure

```
vehicle-expense/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, environment, logging config
│   │   ├── modules/         # Feature modules (auth, users, expenses, etc.)
│   │   ├── middleware/      # Authentication, authorization, error handling
│   │   ├── utils/           # Currency conversion, notifications
│   │   └── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature-specific components
│   │   ├── services/        # API and socket services
│   │   ├── store/           # Redux store and slices
│   │   └── App.jsx          # Main app component
│   └── package.json
├── infra/                   # Infrastructure and deployment configs
├── docs/                    # Documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd vehicle-expense/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vehicle-expense
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd vehicle-expense/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔐 Authentication & Roles

### User Roles
- **ROLE_EXPORTER**: Japan exporters who create and share expenses
- **ROLE_LOCAL**: Sri Lankan users who review shared expenses
- **ROLE_ADMIN**: System administrators with full access

### Authentication Flow
1. Users register with email, password, and role
2. JWT tokens are issued for authentication
3. Role-based middleware protects routes
4. Refresh tokens maintain session persistence

## 💰 Expense Management

### Expense Categories
- Vehicle Purchase
- Freight Shipping
- Packaging
- Insurance
- Customs Duty
- Inspection
- Documentation
- Storage
- Transportation
- Other

### Expense Sharing Flow
1. Exporter creates expense
2. Exporter shares expense with specific Sri Lankan users
3. Sri Lankan users receive notifications
4. Users can accept, reject, or request more information
5. Status updates are sent back to exporters

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Expenses
- `GET /api/expenses` - Get expenses (exporter)
- `POST /api/expenses` - Create expense
- `GET /api/expenses/shared/me` - Get shared expenses (local user)
- `POST /api/expenses/:id/share` - Share expense
- `PUT /api/expenses/:id/share/:userId` - Update share status

### Exporters
- `GET /api/exporters/profile` - Get exporter profile
- `PUT /api/exporters/profile` - Update exporter profile
- `GET /api/exporters/public` - Get public exporters list

## 🔔 Real-time Features

### Socket.IO Events
- `expense_shared` - Notify when expense is shared
- `share_status_updated` - Notify when share status changes
- `notification` - General notifications

### Notification Types
- Email notifications for expense sharing
- Real-time browser notifications
- In-app notification system

## 🛡️ Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Password hashing with bcrypt

## 📊 Database Models

### User Model
- Personal information
- Role and permissions
- Company details
- Preferences and settings

### Expense Model
- Basic expense information
- Vehicle details (if applicable)
- Invoice information
- Sharing status and recipients
- Attachments and documents

### Exporter Model
- Company verification
- Business information
- Document management
- Statistics and metrics

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)
4. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` folder

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication and role management
  - Expense creation and sharing
  - Real-time notifications
  - Dashboard and analytics
