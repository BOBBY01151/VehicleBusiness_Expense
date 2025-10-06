# 🚀 Quick Start Guide for Frontend Development

## 1. Start the Backend
```bash
cd backend
npm run dev
```

## 2. Seed Test Users (One-time setup)
```bash
cd backend
npm run seed
```
This creates:
- 🇱🇰 Sri Lankan User: `srilanka@example.com` / `password123`
- 🇯🇵 Japan Exporter: `exporter@example.com` / `password123`

## 3. Start the Frontend
```bash
cd frontend
npm run dev
```

## 4. Access the Application
- Frontend: http://localhost:3002 (or whatever port Vite shows)
- Backend API: http://localhost:5000

## 5. Quick Login Buttons
On the login page, you'll see two auto-login buttons:
- **🇱🇰 Auto Login as Sri Lankan User** - Takes you directly to the Sri Lankan dashboard
- **🇯🇵 Auto Login as Japan Exporter** - Takes you directly to the Exporter dashboard

## 🎯 What You Can Test

### As Sri Lankan User:
- View shared expenses from exporters
- Accept/reject/request more info on expenses
- Browse exporter directory

### As Japan Exporter:
- Create and manage expenses
- Share expenses with Sri Lankan users
- View expense statistics
- Manage parts inventory

## 🔧 Development Notes
- The auto-login buttons bypass the form and directly authenticate
- Test users are created with proper roles and company information
- Real-time notifications work via Socket.IO
- All CRUD operations are functional

## 🐛 Troubleshooting
- If auto-login fails, make sure you ran `npm run seed` in the backend
- Check that MongoDB is running on localhost:27017
- Ensure both backend (port 5000) and frontend are running
