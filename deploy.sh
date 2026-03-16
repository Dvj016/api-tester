#!/bin/bash

# Quick Deployment Script for Linux/Mac
# Automatically commits and pushes changes to trigger deployment

echo ""
echo "========================================"
echo "  AI API Key Tester - Quick Deploy"
echo "========================================"
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Error: git is not installed"
    exit 1
fi

# Show current changes
echo "📋 Current Changes:"
echo ""
git status --short
echo ""

# Ask for commit message
read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Update: Deploy latest changes"
fi

echo ""
echo "📦 Adding all changes..."
git add .

echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  No changes to commit or commit failed"
    echo ""
    read -p "Do you want to force push anyway? (y/n): " FORCE_PUSH
    if [[ ! $FORCE_PUSH =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ✅ Deployment Started Successfully!"
    echo "========================================"
    echo ""
    echo "📊 Deployment Status:"
    echo ""
    echo "🔧 Backend (Render):"
    echo "   - Auto-deploying now..."
    echo "   - Time: ~2-3 minutes"
    echo "   - Check: https://dashboard.render.com"
    echo ""
    echo "🎨 Frontend (Vercel):"
    echo "   - Auto-deploying now..."
    echo "   - Time: ~1-2 minutes"
    echo "   - Check: https://vercel.com/dashboard"
    echo ""
    echo "💡 Tip: Run './check-status.sh' in 3 minutes to verify deployment"
    echo ""
else
    echo ""
    echo "❌ Error: Failed to push changes"
    echo ""
    echo "Possible issues:"
    echo "1. No internet connection"
    echo "2. Git authentication failed"
    echo "3. Remote repository not configured"
    echo ""
    echo "Try running: git push origin main"
    echo ""
    exit 1
fi

# Made with Bob
