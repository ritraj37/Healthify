#!/bin/bash

# Healthify - Quick Deployment Script
# This script helps update all localhost URLs to production URLs

echo "🚀 Healthify Deployment Helper"
echo "================================"
echo ""

# Get production domain from user
read -p "Enter your production domain (e.g., healthify.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Domain cannot be empty!"
    exit 1
fi

echo ""
echo "📝 Updating URLs in all files..."
echo ""

# Backup original files
echo "Creating backups..."
cp js/main.js js/main.js.backup
cp ai-assistant.js ai-assistant.js.backup
cp js/database-integration.js js/database-integration.js.backup
cp payment.html payment.html.backup
cp video-consultation.html video-consultation.html.backup

# Update API URLs
echo "Updating API URLs..."
sed -i "s|http://localhost:3000/api|https://$DOMAIN/api|g" js/main.js
sed -i "s|http://localhost:45678/api|https://$DOMAIN/ai-api|g" js/main.js
sed -i "s|http://localhost:45678/api|https://$DOMAIN/ai-api|g" ai-assistant.js
sed -i "s|http://localhost:3000/api|https://$DOMAIN/api|g" js/database-integration.js

# Update Video Server URL
echo "Updating Video Server URL..."
sed -i "s|http://localhost:3001|https://$DOMAIN:3001|g" video-consultation.html

echo ""
echo "✅ URLs updated successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Update Razorpay keys in payment.html"
echo "2. Update Twilio credentials in backend/.env"
echo "3. Install SSL certificate"
echo "4. Test all features"
echo ""
echo "💾 Backups created with .backup extension"
echo ""
echo "🎉 Ready for deployment!"
