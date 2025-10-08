# 🚀 Quick Start Guide - Frontend Developer Mode

This guide will help you quickly set up the project with demo accounts for frontend development.

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (running on localhost:27017)
- npm or yarn

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start MongoDB

Make sure MongoDB is running on `localhost:27017`

```bash
# macOS (if using Homebrew)
brew services start mongodb-community

# Or start manually
mongod
```

### 3. Seed Demo Accounts

```bash
cd backend
npm run seed
```

This will create 3 demo accounts:
- 🇱🇰 **Sri Lankan User**: `srilanka@test.com` / `password123`
- 🇯🇵 **Japan Exporter**: `exporter@test.com` / `password123`
- 👤 **Admin**: `admin@test.com` / `password123`

### 4. Start Backend

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

### 5. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 🎯 Quick Login Buttons

On the login page, you'll see **Quick Login** buttons:

### 🇱🇰 Sri Lanka User Button
- **Email**: srilanka@test.com
- **Password**: password123
- **Role**: ROLE_LOCAL (Sri Lankan Importer)
- **Dashboard**: View shared expenses from Japan exporters
- **Actions**: Accept/Reject/Request Info on expenses

### 🇯🇵 Japan Exporter Button
- **Email**: exporter@test.com
- **Password**: password123
- **Role**: ROLE_EXPORTER (Japan Exporter)
- **Dashboard**: Create and manage expenses
- **Actions**: Share expenses with Sri Lankan users

## 🔄 Development Workflow

1. **Click Quick Login Button** → Instantly logged in as demo user
2. **No need to type credentials** → Perfect for rapid frontend testing
3. **Test both roles** → Switch between Sri Lankan and Exporter views
4. **Real data** → Demo accounts have proper profiles and permissions

## 📱 Features to Test

### As Sri Lankan User (🇱🇰)
- ✅ View shared expenses dashboard
- ✅ Review expense details
- ✅ Accept/Reject expenses
- ✅ Request more information
- ✅ View exporter profiles
- ✅ Real-time notifications

### As Japan Exporter (🇯🇵)
- ✅ Create new expenses
- ✅ Manage expense list
- ✅ Share expenses with Sri Lankan users
- ✅ View statistics
- ✅ Track shared expense status
- ✅ Parts management

## 🎨 UI Components Available

All components are styled with Tailwind CSS:
- Modern, responsive design
- Role-based navigation
- Real-time updates
- Toast notifications
- Modal dialogs
- Form validation

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
brew services start mongodb-community
```

### Port Already in Use
```bash
# Backend (5000)
lsof -ti:5000 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

### Demo Accounts Not Working
```bash
# Re-run the seed script
cd backend
npm run seed
```

## 📝 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET /auth/profile` - Get profile

### Expenses
- `GET /expenses` - Get expenses (Exporter)
- `POST /expenses` - Create expense
- `GET /expenses/shared/me` - Get shared expenses (Sri Lanka)
- `POST /expenses/:id/share` - Share expense
- `PUT /expenses/:id/share/:userId` - Update share status

## 🎯 Next Steps

1. **Test the UI** - Use quick login buttons to test both roles
2. **Create Expenses** - Login as exporter and create test expenses
3. **Share & Review** - Share expenses and review as Sri Lankan user
4. **Customize** - Modify components in `frontend/src/features/`
5. **Add Features** - Extend the functionality as needed

## 💡 Tips for Frontend Development

- **Hot Reload**: Both frontend and backend support hot reload
- **Redux DevTools**: Install Redux DevTools extension for state debugging
- **API Logs**: Check backend terminal for API request logs
- **Network Tab**: Use browser DevTools to inspect API calls
- **Toast Messages**: All actions show toast notifications for feedback

## 🚀 Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## 📚 Additional Resources

- Frontend: React + Vite + Redux Toolkit + Tailwind CSS
- Backend: Node.js + Express + MongoDB + Socket.IO
- Authentication: JWT with role-based access control
- Real-time: Socket.IO for live notifications

---

**Happy Coding! 🎉**

For issues or questions, check the main README.md or create an issue.
