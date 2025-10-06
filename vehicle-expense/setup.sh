#!/bin/bash

echo "🚀 Setting up Vehicle Expense Management System..."

# Backend setup
echo "📦 Setting up backend..."
cd backend
npm install
cp .env.example .env
echo "✅ Backend setup complete!"

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend
npm install
cp .env.example .env
echo "✅ Frontend setup complete!"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start MongoDB (make sure it's running on localhost:27017)"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""
echo "Default environment files have been created. Please update them with your configuration."
