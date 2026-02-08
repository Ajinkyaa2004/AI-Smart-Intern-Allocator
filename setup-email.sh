#!/bin/bash

# Quick setup script for email notifications
# This creates a basic .env file if it doesn't exist

echo "📧 Setting up Email Notifications for InternMatch AI"
echo "===================================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Please edit it manually."
    echo "   Add the following variables:"
    echo ""
else
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
fi

echo "Required Email Configuration:"
echo "----------------------------"
echo "EMAIL_ENABLED=true"
echo "SMTP_HOST=smtp.gmail.com"
echo "SMTP_PORT=587"
echo "SMTP_SECURE=false"
echo "SMTP_USER=your-email@gmail.com"
echo "SMTP_PASSWORD=your-app-password"
echo "EMAIL_FROM=InternMatch AI <noreply@internmatch.ai>"
echo ""

echo "📋 Setup Steps:"
echo "1. Edit .env file with your SMTP credentials"
echo "2. For Gmail: Enable 2FA and create App Password"
echo "   https://myaccount.google.com/apppasswords"
echo "3. Install dependencies: npm install"
echo "4. Restart server: npm run dev"
echo ""

echo "🧪 Test Email Service:"
echo "Run: node -e \"require('./server/services/emailService').sendEmail({to:'test@example.com', subject:'Test', html:'<h1>Test</h1>'})\""
echo ""

echo "✅ Setup guide complete!"
