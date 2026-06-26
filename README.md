# AI Code Reviewer

Full-stack MERN application that uses GPT-4 to review code and provide structured feedback.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Environment Variables

Create `backend/.env`:

```
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=mongodb://localhost:27017/ai-code-reviewer
JWT_SECRET=your_jwt_secret
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/review` | Review code with Groq AI (auth required) |
| GET | `/api/history` | Get review history (auth required) |
| GET | `/api/history/:id` | Get single review (auth required) |

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, react-simple-code-editor, Prism.js
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Groq (Llama 3)
