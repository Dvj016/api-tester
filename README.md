# AI API Key Tester

A production-ready web application for testing AI API keys across multiple providers.

## Features

- 🔑 Test API keys for OpenAI, Anthropic, Google Gemini, and NVIDIA NIM
- ⚡ Real-time latency measurement
- 🎨 Modern, clean UI with dark mode
- 📱 Mobile-friendly responsive design
- 🔒 Secure - keys are never stored
- 🐳 Docker-ready backend
- ☁️ Vercel-ready frontend

## Project Structure

```
API_Tester/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── config.py       # Configuration
│   │   ├── models.py       # Pydantic models
│   │   ├── routers/        # API routes
│   │   │   ├── __init__.py
│   │   │   ├── openai.py
│   │   │   ├── anthropic.py
│   │   │   ├── gemini.py
│   │   │   └── nvidia.py
│   │   └── utils/          # Utility functions
│   │       ├── __init__.py
│   │       ├── logger.py
│   │       └── security.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ProviderSelector.tsx
│   │   │   ├── ModelSelector.tsx
│   │   │   ├── ApiKeyInput.tsx
│   │   │   ├── TestButton.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   └── LoadingAnimation.tsx
│   │   └── lib/
│   │       ├── api.ts
│   │       └── types.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
├── docker-compose.yml
└── README.md
```

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### Docker Setup

```bash
docker-compose up --build
```

## Deployment

### Backend (Docker)

```bash
cd backend
docker build -t ai-api-tester-backend .
docker run -p 8000:8000 ai-api-tester-backend
```

### Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Security Notes

- API keys are NEVER stored in any database
- Keys are only used for temporary testing requests
- All keys are masked in logs
- CORS is configured for security
- Request timeouts prevent hanging connections

## License

MIT