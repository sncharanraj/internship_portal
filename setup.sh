#!/bin/bash

echo "🎓 Internship Portal - Quick Start Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your MongoDB URI and Gmail credentials"
else
    echo "✅ .env file already exists"
fi

echo "📥 Installing backend dependencies..."
npm install

echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

if [ ! -f .env ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
else
    echo "✅ .env file already exists"
fi

echo "📥 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Edit backend/.env and add:"
echo "   - MONGODB_URI (from MongoDB Atlas)"
echo "   - EMAIL_USER (your Gmail address)"
echo "   - EMAIL_PASS (Gmail app password)"
echo "   - ADMIN_EMAIL (where to receive applications)"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm start"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For deployment instructions, see DEVOPS.md"
echo ""
