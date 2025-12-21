# 🚀 TaskWeaver – AI-Powered Meeting Summarizer & Action Tracker

TaskWeaver is a **Gen-AI powered meeting summarization platform** that transforms raw meeting transcripts into **concise summaries and actionable work items**, similar to how JIRA tracks tasks — but directly from conversations.

Built using **Next.js, FastAPI, LangChain, and MongoDB**, TaskWeaver is designed for **teams, professionals, and organizations** that want to save time, improve accountability, and never miss critical follow-ups from meetings.

---

## ✨ Key Features

### 🧠 AI-Powered Meeting Summarization
- Generate **concise, structured summaries** from meeting transcripts
- Uses **LangChain + LLMs** to extract:
  - Key discussion points
  - Decisions made
  - Important highlights

### ✅ JIRA-like Action Item Tracking
- Automatically extracts **action items** from transcripts
- Tracks:
  - Task description
  - Assignee
  - Due date
  - Status (Pending / In Progress / Completed)
- Manual editing supported for accuracy

### 🔐 Secure Authentication
- **JWT-based authentication**
- Protected routes for meetings, summaries, and tasks
- Role-ready architecture (extensible to admin/team roles)

### 📄 Transcript Management
- Upload and store meeting transcripts
- Full transcript view with search capability
- Clean separation of transcript, summary, and tasks

### 📊 Scalable Backend Architecture
- **FastAPI** for high-performance APIs
- **MongoDB** for scalable and flexible data storage
- Clean schema design for meetings, users, transcripts, and action items

---

## 🛠 Tech Stack

### Frontend
- **Next.js**
- Tailwind CSS
- React Toast notifications
- Fully reusable component-based UI

### Backend
- **FastAPI (Python)**
- **LangChain / LangGraph**
- MongoDB (PyMongo / Motor)
- JWT Authentication
- RESTful API architecture

### AI / Gen-AI
- Large Language Models (LLMs)
- Prompt-based summarization
- Action item extraction via NLP pipelines

---


---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (>= 18)
- Python (>= 3.9)
- MongoDB (local or cloud)
- OpenAI / LLM API Key

---

## 🔧 Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## 🔧 Environment Variables

### Backend
- MONGO_URI=mongodb://localhost:27017/taskweaver
- GROQ_API_KEY=your_openai_api_key
- SECRET_KEY=your_jwt_secret_key
- ALGORITHM=HS256
- ACCESS_TOKEN_EXPIRE_MINUTES=60
- MODEL=your_llm_model
- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret
- REDIRECT_URI=http://localhost:8000/auth/google/callback
- FRONTEND_URL=http://localhost:3000

### Frontend
- NEXT_PUBLIC_API_URL=http://localhost:8000


## Run Backend Server
- uvicorn main:app --reload
- Backend will run at port 8000


## Run Frontend
- cd frontend
- npm install
- npm run dev
- Frontend will run at port 3000
