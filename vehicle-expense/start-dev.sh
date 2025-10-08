#!/bin/bash

echo "🚀 Starting Vehicle Expense Management System (Dev Mode)"
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "  brew services start mongodb-community"
    echo "  OR"
    echo "  mongod"
    exit 1
fi

echo "✅ MongoDB is running"
echo ""

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "✅ Dependencies installed"
echo ""

# Check if demo accounts exist
echo "🔍 Checking demo accounts..."
cd backend
if ! node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/vehicle-expense').then(() => { const User = require('./src/modules/users/user.model'); return User.findOne({email: 'srilanka@test.com'}); }).then(user => { if(!user) process.exit(1); process.exit(0); }).catch(() => process.exit(1));" 2>/dev/null; then
    echo "📝 Creating demo accounts..."
    npm run seed
else
    echo "✅ Demo accounts already exist"
fi
cd ..

echo ""
echo "🎯 Starting servers..."
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Quick Login Credentials:"
echo "  🇱🇰 Sri Lanka: srilanka@test.com / password123"
echo "  🇯🇵 Exporter: exporter@test.com / password123"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start backend and frontend in parallel
trap 'kill 0' EXIT

cd backend && npm run dev &
cd frontend && npm run dev &

wait
