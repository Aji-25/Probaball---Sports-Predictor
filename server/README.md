# Newsport Backend Server

A Node.js + Express backend server for sports prediction API.

## Features

- 🏥 Health check endpoint
- 🤖 LLM query processing for sports predictions
- 📊 Baseline statistical model
- 🔗 Optional external LLM API integration
- 📚 Built-in API documentation
- 🛡️ CORS enabled
- 🔧 Environment variable configuration

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` to configure:
- `PORT`: Server port (default: 5000)
- `LLM_API_URL`: External LLM API URL (optional)
- `LLM_API_KEY`: API key for external LLM (optional)

### 3. Start Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://127.0.0.1:5000` (or your configured port).

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and uptime.

### Sports Prediction
```
POST /api/llm-query
Content-Type: application/json

{
  "query": "Will Barcelona beat Real Madrid?"
}
```

**Response:**
```json
{
  "query": "Will Barcelona beat Real Madrid?",
  "probability": {
    "teamA": 55,
    "draw": 20,
    "teamB": 25
  },
  "stats": {
    "recentForm": {
      "teamA": ["W","W","D","W","L"],
      "teamB": ["L","D","L","W","W"]
    },
    "avgGoals": {
      "teamA_for": 2.1,
      "teamB_for": 1.6
    }
  },
  "insight": "Barcelona has better recent form and scoring average."
}
```

### Player Performance
```
POST /api/llm-query
Content-Type: application/json

{
  "query": "How will Messi perform in the next match?"
}
```

### API Documentation
```
GET /api/docs
```
Returns complete API documentation with examples.

## Supported Queries

### Team vs Team
- "Will Barcelona beat Real Madrid?"
- "Barcelona vs Real Madrid"
- "Does Manchester City defeat Arsenal?"

### Player Performance
- "How will Messi perform?"
- "Will Haaland score goals?"
- "Messi goals prediction"

## Architecture

```
server/
├── server.js              # Main server file
├── routes/
│   └── llm.js             # LLM query processing
├── services/
│   ├── sports.js          # Mock sports data
│   └── models.js          # Baseline prediction model
├── package.json
├── env.example
└── README.md
```

## Baseline Model

The server includes a statistical baseline model that calculates probabilities based on:

- **Recent Form** (40% weight): Win/Loss/Draw records
- **Goal Statistics** (30% weight): Scoring averages
- **Head-to-Head** (20% weight): Historical matchups
- **Home Advantage** (10% weight): Venue factors

## External LLM Integration

To use an external LLM API:

1. Set `LLM_API_URL` in your `.env` file
2. Optionally set `LLM_API_KEY` for authentication
3. The server will forward queries with stats to your LLM API
4. If the LLM API fails, it falls back to the baseline model

## Testing

Run the test script to verify all endpoints:

```bash
node test-api.js
```

## Development

The server uses:
- **Express.js** for the web framework
- **CORS** for cross-origin requests
- **dotenv** for environment variables
- **axios** for HTTP requests
- **nodemon** for development auto-restart

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure your production environment variables
3. Use a process manager like PM2
4. Set up reverse proxy (nginx/Apache)
5. Configure SSL/TLS certificates
