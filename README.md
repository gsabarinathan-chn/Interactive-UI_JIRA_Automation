# TestForge AI 🚀

> **JIRA User Story → AI Test Cases → Playwright Scripts** in one click

An interactive full-stack app that fetches JIRA stories, auto-generates comprehensive test cases using Claude AI, then converts them into production-ready Playwright TypeScript test scripts.

---

## ✨ Features

- 🔗 **JIRA Integration** — Fetch any story via JIRA REST API v3
- 🤖 **AI Test Case Generation** — Claude Sonnet 4 generates 6-10 test cases (positive, negative, edge)
- 🎭 **Playwright Script Generation** — Converts test cases to Python  Playwright specs
- 💾 **Download & Copy** — Export `.spec.ts` files instantly
- 🎨 **Dark industrial UI** — Clean, fast, professional interface

---

## 🏗️ Architecture

```
frontend/          React 18 app (UI)
backend/           Express.js proxy API
  └─ server.js     Handles JIRA + Claude API calls
```

The backend acts as a secure proxy — API keys are sent per-request from the frontend and never stored server-side.

---

## 🚀 Quick Start (Local)

### 1. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Run locally

```bash
# Terminal 1 — Backend
cd backend && npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend
cd frontend && npm start
# → http://localhost:3000
```

---

## ☁️ Deploy to Render.com (Recommended — Free Tier)

### Backend

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Deploy → copy the URL (e.g. `https://testforge-backend.onrender.com`)

### Frontend

1. Render → New → Static Site
2. Connect same repo
3. Set:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` = `https://testforge-backend.onrender.com`
5. Deploy!

---

## ☁️ Deploy to Vercel + Render

### Backend on Render (same steps as above)

### Frontend on Vercel

```bash
npm i -g vercel
cd frontend
REACT_APP_API_URL=https://your-backend.onrender.com npm run build
vercel --prod
```

Or via Vercel dashboard:
1. Import repo → set root to `frontend`
2. Add env var: `REACT_APP_API_URL=https://your-backend.onrender.com`
3. Deploy!

---

## 🔑 API Keys Required

| Key | Where to Get | Free Tier |
|-----|-------------|-----------|
| **JIRA API Token** | [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens) | ✅ Free |
| **Claude API Key** | [console.anthropic.com](https://console.anthropic.com) | ✅ Free credits |

---

## 📂 Project Structure

```
jira-testgen/
├── backend/
│   ├── server.js          # Express API proxy
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
├── render.yaml            # Render deployment config
├── vercel.json            # Vercel deployment config
└── README.md
```

---

## 🎭 Using Generated Playwright Tests

```bash
# Initialize Playwright in your project
npm init playwright@latest

# Copy the downloaded .spec.ts file
cp PROJECT-123.spec.ts tests/

# Run tests
npx playwright test PROJECT-123.spec.ts

# Run with UI
npx playwright test --ui
```

---

## 🛡️ Security Notes

- API keys are sent per-request and **never stored** on the server
- All JIRA calls go through the backend proxy to hide credentials from browser network tab
- For production, consider adding rate limiting and request validation

---

## 📄 License

MIT — free to use and modify.
