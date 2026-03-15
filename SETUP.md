# Setup Guide - AI API Key Tester

Quick start guide to get the application running locally.

## Prerequisites

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Docker** (optional) - [Download](https://www.docker.com/)

## Quick Start (5 minutes)

### Option 1: Using Docker Compose (Easiest)

```bash
# Clone the repository
git clone <your-repo-url>
cd API_Tester

# Start both backend and frontend
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be running at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

#### Step 2: Frontend Setup (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the development server
npm run dev
```

The frontend will be running at: http://localhost:3000

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Select an AI provider (OpenAI, Anthropic, Gemini, or NVIDIA)
3. Select a model from the dropdown
4. Paste your API key
5. Click "Test API Key"
6. View the results with latency metrics

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Test OpenAI Key
```bash
curl -X POST http://localhost:8000/api/openai/test \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "sk-...",
    "model": "gpt-3.5-turbo"
  }'
```

### Get Available Models
```bash
# OpenAI models
curl http://localhost:8000/api/openai/models

# Anthropic models
curl http://localhost:8000/api/anthropic/models

# Gemini models
curl http://localhost:8000/api/gemini/models

# NVIDIA models
curl http://localhost:8000/api/nvidia/models
```

## Project Structure

```
API_Tester/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # Application entry point
│   │   ├── config.py          # Configuration settings
│   │   ├── models.py          # Pydantic models
│   │   ├── routers/           # API route handlers
│   │   │   ├── openai.py
│   │   │   ├── anthropic.py
│   │   │   ├── gemini.py
│   │   │   └── nvidia.py
│   │   └── utils/             # Utility functions
│   │       ├── logger.py
│   │       └── security.py
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker configuration
│   └── .env.example          # Environment template
│
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx      # Main page
│   │   │   └── globals.css
│   │   ├── components/       # React components
│   │   │   ├── LoadingAnimation.tsx
│   │   │   └── ResultCard.tsx
│   │   └── lib/              # Utilities
│   │       ├── api.ts        # API client
│   │       └── types.ts      # TypeScript types
│   ├── package.json          # Node dependencies
│   ├── Dockerfile           # Docker configuration
│   └── .env.example         # Environment template
│
├── docker-compose.yml        # Docker Compose config
├── README.md                 # Project overview
├── SETUP.md                  # This file
└── DEPLOYMENT.md            # Deployment guide
```

## Environment Variables

### Backend (.env)

```env
ENVIRONMENT=development
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:3000
API_TIMEOUT=30
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Troubleshooting

### Backend Issues

**Problem: Port 8000 already in use**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

**Problem: Module not found**
```bash
# Make sure virtual environment is activated
pip install -r requirements.txt
```

**Problem: CORS errors**
- Check `ALLOWED_ORIGINS` in backend/.env
- Ensure frontend URL is included

### Frontend Issues

**Problem: Port 3000 already in use**
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Problem: Cannot connect to backend**
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in .env.local
- Ensure no firewall blocking

**Problem: Build errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

### Docker Issues

**Problem: Container won't start**
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up --build
```

**Problem: Port conflicts**
```bash
# Stop all containers
docker-compose down

# Change ports in docker-compose.yml if needed
```

## Development Tips

### Backend Development

- **Auto-reload**: The `--reload` flag enables automatic reloading on code changes
- **API Documentation**: Visit `/docs` for interactive Swagger UI
- **Logging**: Check console for detailed logs
- **Testing**: Use `/docs` to test endpoints directly

### Frontend Development

- **Hot Reload**: Changes automatically refresh in browser
- **TypeScript**: Type checking helps catch errors early
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Dark Mode**: Enabled by default, toggle in UI

## Next Steps

1. **Customize**: Modify the UI colors, layout, or add features
2. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. **Contribute**: Submit issues or pull requests
4. **Extend**: Add support for more AI providers

## Getting Help

- **Documentation**: Check README.md and DEPLOYMENT.md
- **API Docs**: http://localhost:8000/docs
- **Issues**: Report bugs on GitHub
- **Community**: Join discussions

## Security Notes

⚠️ **Important Security Information:**

- API keys are **NEVER** stored in any database
- Keys are only used for the test request
- All keys are masked in logs (only last 4 characters shown)
- Use HTTPS in production
- Keep dependencies updated
- Don't commit `.env` files to version control

## License

MIT License - See LICENSE file for details