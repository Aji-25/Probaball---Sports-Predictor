# ⚽ Probaball – Sports Predictor

Probaball is an AI-powered sports prediction web app that helps fans, analysts, and bettors make smarter decisions.  
Built in **24 hours for a hackathon**, it combines **live sports data APIs** with **Gemini LLM prompt engineering** to deliver match insights, player analysis, and betting recommendations in real time.

---

## 🚀 Features

- 🔍 **Universal Query Support** – Ask *anything* about football (soccer):
  - “Barcelona vs Real Madrid”
  - “How will Messi perform?”
  - “Over 2.5 goals analysis”
- 📊 **Match Predictions Dashboard**
  - Win probability pie chart  
  - Recent form analysis (badges or descriptive text)  
  - Average goals scored & conceded per game
- 🎯 **Smart Bets**
  - AI-suggested bets with confidence scores  
  - Example: *“Smart Bet: Over 2.5 goals, 72% confidence”*
- 🤖 **Gemini-Powered AI**
  - Generates human-like insights from stats & context  
  - Handles any query format (teams, players, betting odds, general questions)
- 🎨 **Modern UI/UX**
  - Built with React + TailwindCSS  
  - Responsive, dark-theme friendly design

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- TailwindCSS
- Chart.js (for predictions & data viz)

**Backend**
- Node.js + Express
- REST API endpoints
- Integration with **Gemini 2.5 Flash** (via prompt engineering)
- SportMonks Football API (for live stats)

**Other**
- Universal query parsing with regex + LLM
- Error handling with fallback analysis
- `.env` for API key management

---

## ⚡ Getting Started

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/Probaball---Sports-Predictor.git
cd Probaball---Sports-Predictor

2️⃣ Install dependencies

Frontend:
cd client
npm install

Backend:
cd ../server
npm install

3️⃣ Add environment variables

Create a .env file inside /server:
PORT=5000
GEMINI_API_KEY=your_gemini_api_key

4️⃣ Run the project

Start backend:
cd server
npm run dev

Start frontend:
cd ../client
npm run dev

App will be available at:
Frontend → http://127.0.0.1:5173
Backend  → http://127.0.0.1:5000

📊 Example Queries to Try

Team vs Team: "Barcelona vs Real Madrid"

Player Prediction: "Messi goals prediction"

General Analysis: "Over 2.5 goals analysis"

🏆 Hackathon Impact

🎯 Solves real problem: AI insights for football fans & bettors

⏱️ Built in 24 hours – full stack app with AI + live data

✨ Combines sports analytics + LLM reasoning in one platform

💡 Extensible: cricket, basketball, esports, etc.

📌 Future Improvements

Multi-sport support (Cricket, NBA, etc.)

User accounts + saved predictions

Betting odds API integration

Voice assistant mode (“Hey Probaball, will Arsenal win?”)

---
🌟 Vision
Probaball is just the beginning. Our goal is to make AI-powered sports insights accessible to fans worldwide — from match predictions to betting strategies, and across football, cricket, basketball, and beyond.  

Stay tuned — this is only half-time. The second half will be even more exciting! ⚽🚀
