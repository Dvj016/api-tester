# Deployment Guide

This guide covers deploying the AI API Key Tester application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Environment Variables](#environment-variables)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (for containerized deployment)
- Git

## Local Development

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run the development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# From project root directory
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Docker Containers

**Backend:**
```bash
cd backend
docker build -t ai-api-tester-backend .
docker run -p 8000:8000 \
  -e ENVIRONMENT=production \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  ai-api-tester-backend
```

**Frontend:**
```bash
cd frontend
docker build -t ai-api-tester-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  ai-api-tester-frontend
```

## Backend Deployment

### Option 1: Cloud Platforms (AWS, GCP, Azure)

#### AWS EC2 / Elastic Beanstalk

1. **Prepare the application:**
```bash
cd backend
zip -r backend.zip . -x "*.git*" -x "*__pycache__*" -x "*.env"
```

2. **Deploy to Elastic Beanstalk:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init -p python-3.11 ai-api-tester-backend

# Create environment
eb create production-env

# Deploy
eb deploy
```

3. **Set environment variables in EB console:**
- `ENVIRONMENT=production`
- `LOG_LEVEL=INFO`
- `ALLOWED_ORIGINS=https://your-frontend-domain.com`
- `API_TIMEOUT=30`

#### Google Cloud Run

```bash
cd backend

# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-api-tester-backend

# Deploy to Cloud Run
gcloud run deploy ai-api-tester-backend \
  --image gcr.io/PROJECT_ID/ai-api-tester-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production,ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Option 2: VPS (DigitalOcean, Linode, etc.)

1. **SSH into your server:**
```bash
ssh user@your-server-ip
```

2. **Install dependencies:**
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv nginx
```

3. **Clone and setup:**
```bash
git clone https://github.com/yourusername/ai-api-tester.git
cd ai-api-tester/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

4. **Create systemd service:**
```bash
sudo nano /etc/systemd/system/ai-api-tester.service
```

```ini
[Unit]
Description=AI API Key Tester Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/ai-api-tester/backend
Environment="PATH=/path/to/ai-api-tester/backend/venv/bin"
ExecStart=/path/to/ai-api-tester/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

5. **Start service:**
```bash
sudo systemctl start ai-api-tester
sudo systemctl enable ai-api-tester
```

6. **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/ai-api-tester
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ai-api-tester /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Frontend Deployment (Vercel)

### Method 1: Vercel CLI

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
6. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://api.yourdomain.com`)
7. Click "Deploy"

### Method 3: Netlify

```bash
cd frontend

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Environment Variables

### Backend (.env)

```env
ENVIRONMENT=production
LOG_LEVEL=INFO
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-frontend.vercel.app
API_TIMEOUT=30
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Monitoring & Maintenance

### Health Checks

- Backend health endpoint: `GET /health`
- Expected response: `{"status": "healthy", "timestamp": "..."}`

### Logging

Backend logs are written to stdout. Configure log aggregation:

**For Docker:**
```bash
docker-compose logs -f backend
```

**For systemd:**
```bash
sudo journalctl -u ai-api-tester -f
```

### Monitoring Tools

- **Uptime monitoring:** UptimeRobot, Pingdom
- **Application monitoring:** Sentry, New Relic
- **Log management:** Papertrail, Loggly

### Backup & Updates

```bash
# Pull latest changes
git pull origin main

# Backend update
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart ai-api-tester

# Frontend update (Vercel auto-deploys on git push)
cd frontend
git push origin main
```

### Security Checklist

- [ ] HTTPS enabled (SSL/TLS certificates)
- [ ] CORS properly configured
- [ ] API rate limiting implemented (if needed)
- [ ] Environment variables secured
- [ ] Regular dependency updates
- [ ] Firewall configured
- [ ] Monitoring and alerting setup

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>
```

**Module not found:**
```bash
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**API connection issues:**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify CORS settings in backend
- Check network/firewall rules

## Support

For issues and questions:
- GitHub Issues: [Your Repository URL]
- Documentation: [Your Docs URL]

## License

MIT License - See LICENSE file for details