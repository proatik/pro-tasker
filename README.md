# Task Management Application

A full-stack task management application built with NestJS, React, and MongoDB.

## 🛠 Tech Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Frontend   | React, TypeScript, Tailwind CSS |
| Backend    | NestJS (Node.js)                |
| Database   | MongoDB                         |
| Deployment | Docker                          |

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 22+ (for local development)
- pnpm (package manager)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/proatik/pro-tasker.git

cd pro-tasker
```

### 2. Environment Configuration

Create environment files for backend and frontend:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

### 3. Docker Setup (Recommended)

Start the entire application stack with Docker Compose:

```bash
docker compose up -d --build
```

This will start:

- MongoDB database on port 27017
- NestJS backend on port 3000
- React frontend on port 3030

### 4. Local Development Setup (Alternative)

#### Backend Setup

```bash
cd backend

pnpm install

pnpm run start:dev
```

#### Frontend Setup

```bash
cd frontend

pnpm install

pnpm run dev
```

**Note:** For local development, ensure you use `localhost` or `127.0.0.1` in your environment variables for database connections instead of Docker service names.

## 📚 API Documentation

The Swagger API documentation is available at:

- **http://localhost:3000/docs**

This interactive documentation provides detailed information about all available endpoints, request/response schemas, and allows you to test the API directly from the browser.

## 🐳 Docker Commands

```bash
# Build and start all services
docker compose up -d --build

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

## 📝 Features

- User authentication (register/login)
- Create, read, update, delete tasks
- Task search and filtering
- Responsive design
- Client-side caching with React Query
- Interactive Swagger API documentation
