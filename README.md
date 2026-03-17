# AI API Key Tester

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Copyright](https://img.shields.io/badge/Copyright-2024--2026%20Digvijay%20Singh%20Baghel-blue)](https://github.com/Dvj016)
[![GitHub](https://img.shields.io/badge/GitHub-Dvj016-181717?logo=github)](https://github.com/Dvj016/api-tester)

> **Copyright © 2024-2026 Digvijay Singh Baghel (Dvj016)**  
> All Rights Reserved. Licensed under [MIT License](LICENSE).

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

## License & Copyright

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for full details.

**Copyright © 2024-2026 Digvijay Singh Baghel (Dvj016)**
All Rights Reserved.

### Important Legal Information

- **Trademark**: "AI API Key Tester" is a trademark of Digvijay Singh Baghel
- **Attribution Required**: Any use must include proper attribution to the original author
- **Copyright Notice**: Must be retained in all copies or substantial portions
- **Full Terms**: See [COPYRIGHT.md](COPYRIGHT.md) for complete copyright information

### Contact

- **Author**: Digvijay Singh Baghel
- **GitHub**: [@Dvj016](https://github.com/Dvj016)
- **Email**: digvijay.baghel@ibm.com
- **Repository**: https://github.com/Dvj016/api-tester

---

**Made with ❤️ by Digvijay Singh Baghel**