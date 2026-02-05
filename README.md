<p align="center">
  <h1 align="center">✨ Super CV AI</h1>
</p>



<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-11-e0234e?logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google" alt="Gemini AI" />
</p>

---

## 📖 Overview

**Super CV AI** is a sophisticated, enterprise-grade monorepo platform designed to revolutionize how professionals craft and optimize their resumes. Leveraging the power of Google Gemini AI, it provides intelligent analysis, personalized recommendations, and a premium editing experience.

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 16.1 | React Framework with App Router |
| [React](https://react.dev/) | 19.2 | UI Library |
| [TailwindCSS](https://tailwindcss.com/) | 3.4 | Utility-First CSS |
| [Framer Motion](https://www.framer.com/motion/) | 12.x | Animations & Transitions |
| [NextAuth.js](https://next-auth.js.org/) | 5.0 (beta) | Authentication (Google OAuth) |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0 | State Management |
| [TanStack Query](https://tanstack.com/query) | 5.x | Server State Management |
| [Lucide React](https://lucide.dev/) | latest | Icon Library |
| [@dnd-kit](https://dndkit.com/) | 6.x | Drag & Drop Support |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| [NestJS](https://nestjs.com/) | 11.0 | Node.js Framework |
| [Prisma](https://www.prisma.io/) | 6.19 | ORM & Database Toolkit |
| [PostgreSQL](https://www.postgresql.org/) | 15 | Relational Database |
| [BullMQ](https://bullmq.io/) | 5.x | Job Queue |
| [Redis](https://redis.io/) | 7 | Caching & Queue Backend |
| [Helmet](https://helmetjs.github.io/) | 8.x | Security Headers |
| [class-validator](https://github.com/typestack/class-validator) | 0.14 | Request Validation |

### AI Engine

| Technology | Version | Purpose |
|------------|---------|---------|
| [FastAPI](https://fastapi.tiangolo.com/) | latest | Python API Framework |
| [Google Gemini](https://ai.google.dev/) | latest | AI/LLM Integration |
| [PyPDF](https://pypdf.readthedocs.io/) | latest | PDF Parsing |
| [python-docx](https://python-docx.readthedocs.io/) | latest | DOCX Parsing |
| [Uvicorn](https://www.uvicorn.org/) | latest | ASGI Server |
| [HTTPX](https://www.python-httpx.org/) | latest | Async HTTP Client |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker & Docker Compose | Container Orchestration |
| PostgreSQL 15 Alpine | Production Database |
| Redis 7 Alpine | Queue & Cache |

---

## 🏗️ Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│                 │      │                  │      │                 │
│   Frontend      │─────▶│    Backend       │─────▶│   AI Engine     │
│   (Next.js)     │      │    (NestJS)      │      │   (FastAPI)     │
│   Port: 3000    │      │    Port: 3001    │      │   Port: 8000    │
│                 │      │                  │      │                 │
└─────────────────┘      └────────┬─────────┘      └─────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
              ┌─────▼─────┐ ┌─────▼─────┐       │
              │ PostgreSQL│ │   Redis   │       │
              │  Port:5432│ │  Port:6379│       │
              └───────────┘ └───────────┘       │
                                                │
                                    ┌───────────▼───────────┐
                                    │    Google Gemini AI   │
                                    │     (External API)    │
                                    └───────────────────────┘
```

**Data Flow:**
1. **Frontend** → User uploads CV and (optionally) a job description
2. **Backend** → Validates request, stores metadata in PostgreSQL, queues processing job in Redis/BullMQ
3. **AI Engine** → Parses PDF/DOCX, extracts text, sends to Google Gemini for analysis
4. **Backend** → Receives webhook callback with results, stores analysis
5. **Frontend** → Displays real-time scoring, suggestions, and editable CV

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | ≥ 18.x |
| **Python** | ≥ 3.11 |
| **Docker** | ≥ 24.x |
| **Docker Compose** | ≥ 2.x |
| **pnpm / npm / yarn** | Latest |

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/super-cv.git
   cd super-cv
   ```

2. **Create your environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure the required variables** (see [Environment Variables](#-environment-variables) section below).

---

### 🐳 Installation Method 1: Docker (Recommended)

The easiest way to get the entire stack running:

```bash
# Start all services (builds images on first run)
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

**Services will be available at:**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:3001
- 🤖 **AI Engine:** http://localhost:8000
- 🗄️ **PostgreSQL:** localhost:5432
- 📦 **Redis:** localhost:6379

**Useful Docker Commands:**
```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Rebuild a specific service
docker-compose up --build backend
```

---

### 🔧 Installation Method 2: Manual Setup

For development with hot-reload, run each service separately.

#### 1. Database & Redis

Start PostgreSQL and Redis (using Docker or locally installed):

```bash
# Using Docker for databases only
docker-compose up postgres redis -d
```

#### 2. Backend (NestJS)

```bash
cd apps/backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

The backend will be running at `http://localhost:3001`

#### 3. AI Engine (Python/FastAPI)

```bash
cd apps/ai-engine

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start development server
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The AI Engine will be running at `http://localhost:8000`

#### 4. Frontend (Next.js)

```bash
cd apps/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be running at `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| **Database** |||
| `POSTGRES_USER` | PostgreSQL username | `supercv` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `your_secure_password` |
| `POSTGRES_DB` | Database name | `supercv` |
| `DATABASE_URL` | Full connection string | `postgresql://user:pass@localhost:5432/db` |
| **Redis** |||
| `REDIS_HOST` | Redis hostname | `localhost` or `redis` (Docker) |
| `REDIS_PORT` | Redis port | `6379` |
| **Backend** |||
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your_jwt_secret_here...` |
| `AI_ENGINE_URL` | AI Engine internal URL | `http://ai-engine:8000` (Docker) |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| **AI Engine** |||
| `GEMINI_API_KEY` | Google Gemini API key | Get from [AI Studio](https://aistudio.google.com/app/apikey) |
| `BACKEND_WEBHOOK_URL` | Webhook callback URL | `http://backend:3001/cv/webhook` |
| **Frontend** |||
| `NEXT_PUBLIC_API_URL` | Public API URL | `http://localhost:3001` |
| `NEXTAUTH_URL` | NextAuth base URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth secret (min 32 chars) | `your_nextauth_secret...` |
| **OAuth** |||
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Get from [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Get from Google Cloud Console |

---

## ✨ Features

### 🎯 AI-Powered CV Analysis
- **Intelligent Scoring** — Real-time CV scoring based on industry standards
- **Weakness Detection** — Identifies areas for improvement
- **Tailored Recommendations** — Personalized suggestions based on target job
- **ATS Optimization** — Ensure your CV passes Applicant Tracking Systems

### 💳 Credit-Based System
- **1 Free Credit** — Every new user gets 1 free credit to try the service
- **Flexible Pricing** — Purchase credits in packages (1, 3, or 5 credits)
- **Never Expires** — Purchased credits never expire
- **WhatsApp Ordering** — Easy credit purchase via WhatsApp (payment gateway coming soon)

### 📄 Smart Document Processing
- **PDF Parsing** — Extract content from PDF resumes
- **DOCX Support** — Full Microsoft Word document compatibility
- **Text Extraction** — Intelligent content recognition

### 🎨 Luxury User Experience
- **Premium UI** — Modern, glassmorphic design with Framer Motion animations
- **Drag & Drop Editor** — Intuitive CV section reordering
- **Real-time Updates** — Live preview as you edit
- **Custom Cursor Effects** — Premium interactive cursor design

### 🔐 Enterprise Security
- **Google OAuth** — Secure authentication via NextAuth.js
- **JWT Sessions** — Stateless, secure API authentication
- **Rate Limiting** — Built-in request throttling with NestJS Throttler

### 🎯 Job Description Matching
- **URL Scraping** — Automatically fetch job descriptions from URLs
- **Custom JD Input** — Paste job descriptions directly
- **AI Customization** — Tailor your CV to specific job requirements
- **Multi-language Support** — Customize CV language for different markets

### 🤖 AI Career Coach (Dify Integration)
- **Interactive Chatbot** — Get career advice and CV tips
- **Contextual Help** — AI assistant understands your CV context

### 🚀 Production Ready
- **Docker Compose** — One-command deployment
- **Health Checks** — Built-in service monitoring
- **Scalable Architecture** — Microservices-ready design

---

## 📁 Project Structure

```
super-cv/
├── apps/
│   ├── frontend/          # Next.js 16 application
│   │   ├── src/
│   │   │   ├── app/       # App Router pages
│   │   │   ├── components/ # Shared UI components
│   │   │   ├── features/  # Feature modules (auth, analysis, editor)
│   │   │   ├── hooks/     # Custom React hooks
│   │   │   └── lib/       # Utilities and helpers
│   │   └── Dockerfile
│   │
│   ├── backend/           # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/      # Authentication module
│   │   │   ├── cv/        # CV processing module
│   │   │   └── prisma/    # Database service
│   │   ├── prisma/        # Schema & migrations
│   │   └── Dockerfile
│   │
│   └── ai-engine/         # Python FastAPI service
│       ├── src/
│       │   ├── services/  # AI, extraction, scraping
│       │   └── schemas/   # Pydantic models
│       ├── main.py
│       └── Dockerfile
│
├── docker-compose.yml     # Full-stack orchestration
├── .env.example           # Environment template
└── README.md
```

---

## 🧪 Development

### Running Tests

```bash
# Backend unit tests
cd apps/backend
npm run test

# Backend e2e tests
npm run test:e2e

# Frontend linting
cd apps/frontend
npm run lint
```

### Database Management

```bash
cd apps/backend

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

---

## 📄 License


