#!/bin/bash

# Visitor Counter Update Deployment Script
# This script helps deploy the visitor counter updates to your live application

echo "🚀 AI API Key Tester - Visitor Counter Update Deployment"
echo "=========================================================="
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Show current status
echo "📊 Current Git Status:"
git status --short
echo ""

# Ask for confirmation
read -p "Do you want to commit and push these changes? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Add all changes
echo "📦 Adding changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Fix visitor counter with custom backend endpoint

- Add analytics router to backend
- Update frontend to use backend endpoint
- Remove dependency on CountAPI.xyz
- Add localStorage fallback for errors"

# Push to main branch
echo "🚀 Pushing to main branch..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Changes pushed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Wait for Render to auto-deploy backend (~2-3 minutes)"
    echo "2. Wait for Vercel to auto-deploy frontend (~1-2 minutes)"
    echo "3. Test your website to verify visitor counter works"
    echo ""
    echo "🔗 Check deployment status:"
    echo "   - Render: https://dashboard.render.com"
    echo "   - Vercel: https://vercel.com/dashboard"
    echo ""
    echo "🧪 Test the backend endpoint:"
    echo "   curl -X POST https://your-backend-url.onrender.com/api/visitors/increment"
    echo ""
    echo "📖 For detailed instructions, see: VISITOR_COUNTER_UPDATE.md"
else
    echo ""
    echo "❌ Error: Failed to push changes"
    echo "Please check your git configuration and try again"
    exit 1
fi

# Made with Bob
