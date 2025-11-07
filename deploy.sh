#!/bin/bash

# 🚀 Quick Deployment Script for Task Manager App

echo "╔════════════════════════════════════════╗"
echo "║   Task Manager - Deployment Setup    ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check for .gitignore
if [ ! -f .gitignore ]; then
    echo "⚠️  Warning: .gitignore not found"
else
    echo "✅ .gitignore exists"
fi

# Stage all files
echo ""
echo "📝 Staging files..."
git add .

# Commit
echo ""
read -p "Enter commit message (default: 'Initial commit: Task management app'): " commit_msg
commit_msg=${commit_msg:-"Initial commit: Task management app"}
git commit -m "$commit_msg"
echo "✅ Files committed"

# Ask for GitHub remote
echo ""
echo "🌐 GitHub Setup"
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " repo_url

if [ ! -z "$repo_url" ]; then
    # Check if origin exists
    if git remote | grep -q "^origin$"; then
        echo "📝 Updating origin..."
        git remote set-url origin "$repo_url"
    else
        echo "📝 Adding origin..."
        git remote add origin "$repo_url"
    fi
    
    # Set main branch
    git branch -M main
    
    # Ask to push
    read -p "Push to GitHub now? (y/n): " push_confirm
    if [ "$push_confirm" = "y" ] || [ "$push_confirm" = "Y" ]; then
        echo "🚀 Pushing to GitHub..."
        git push -u origin main
        echo "✅ Pushed to GitHub!"
    else
        echo "ℹ️  To push later, run: git push -u origin main"
    fi
else
    echo "⚠️  No repository URL provided. Skipping GitHub setup."
    echo "ℹ️  To add remote later: git remote add origin <url>"
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║          Setup Complete! 🎉           ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📖 Next steps:"
echo "   1. Read DEPLOYMENT.md for hosting options"
echo "   2. Choose a platform (Render, Vercel, Railway, etc.)"
echo "   3. Set environment variables"
echo "   4. Deploy!"
echo ""
echo "💡 Quick commands:"
echo "   View deployment guide: cat DEPLOYMENT.md"
echo "   Test locally: npm run dev (in backend & frontend)"
echo "   Build frontend: cd frontend && npm run build"
echo "   Docker deploy: docker-compose -f docker-compose.prod.yml up -d"
echo ""
