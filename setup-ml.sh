#!/bin/bash

# ML Setup Script for InternMatch AI
# This script sets up the Python ML environment

echo "🤖 Setting up ML environment for InternMatch AI..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✓ Python 3 found: $(python3 --version)"

# Create ml directory if it doesn't exist
mkdir -p ml/models

# Check if virtual environment exists
if [ ! -d "ml/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    cd ml
    python3 -m venv venv
    cd ..
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo "📥 Installing Python dependencies..."

if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source ml/venv/Scripts/activate
else
    # macOS/Linux
    source ml/venv/bin/activate
fi

pip install --upgrade pip
pip install -r ml/requirements.txt

echo "✓ Python dependencies installed"

# Make Python scripts executable
chmod +x ml/train_model.py
chmod +x ml/predict.py

echo "✓ Python scripts are executable"

# Install Node.js dependencies
echo "📥 Installing Node.js dependencies..."
npm install

echo "✓ Node.js dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# MongoDB
MONGODB_URI=mongodb://localhost:27017/internmatch_ai

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary (for resume uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ML Configuration
USE_ML_SCORING=false
EOF
    echo "✓ .env file created - please update with your credentials"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "✅ ML setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your credentials"
echo "2. Start the server: npm run dev"
echo "3. Create some allocations and ratings (need minimum 10)"
echo "4. Train the model: POST /api/v1/ml/train"
echo "5. Enable ML scoring: Set USE_ML_SCORING=true in .env"
echo ""
echo "For more details, see ML_INTEGRATION.md"
