/**
 * Newsport Backend Server
 * Sports prediction API server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { processLLMQuery } = require('./routes/llm');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${req.method}] ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// LLM query endpoint
app.post('/api/llm-query', processLLMQuery);


// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'Probaball API',
    version: '1.0.0',
    description: 'Sports prediction API server',
    endpoints: {
      'GET /api/health': {
        description: 'Health check endpoint',
        response: { status: 'ok' }
      },
      'POST /api/llm-query': {
        description: 'Process sports prediction queries',
        request: {
          query: 'string - Sports prediction query'
        },
        response: {
          query: 'string',
          probability: {
            teamA: 'number',
            draw: 'number', 
            teamB: 'number'
          },
          stats: {
            recentForm: {
              teamA: 'array',
              teamB: 'array'
            },
            avgGoals: {
              teamA_for: 'number',
              teamB_for: 'number'
            }
          },
          insight: 'string'
        }
      }
    },
    examples: {
      'Team vs Team': {
        query: 'Will Barcelona beat Real Madrid?',
        response: {
          query: 'Will Barcelona beat Real Madrid?',
          probability: { teamA: 55, draw: 20, teamB: 25 },
          stats: {
            recentForm: { teamA: ['W','W','D','W','L'], teamB: ['L','D','L','W','W'] },
            avgGoals: { teamA_for: 2.1, teamB_for: 1.6 }
          },
          insight: 'Barcelona has better recent form and scoring average.'
        }
      },
      'Player Performance': {
        query: 'How will Messi perform in the next match?',
        response: {
          query: 'How will Messi perform in the next match?',
          player: 'Lionel Messi',
          prediction: {
            performanceScore: 85,
            goalProbability: 45,
            assistProbability: 35
          },
          stats: {
            goals: 12,
            assists: 8,
            avgRating: 8.2,
            recentForm: ['W','W','D','W','L']
          },
          insight: 'Lionel Messi has been in good form recently with 12 goals and 8 assists this season.'
        }
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/llm-query',
      'GET /api/docs'
    ]
  });
});

// Start server with port conflict handling
const startServer = (port) => {
  const server = app.listen(port, '127.0.0.1', () => {
    console.log(`🚀 Newsport API server running on http://127.0.0.1:${port}`);
    console.log(`📚 API Documentation: http://127.0.0.1:${port}/api/docs`);
    console.log(`🏥 Health Check: http://127.0.0.1:${port}/api/health`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    if (process.env.GEMINI_API_KEY) {
      console.log(`🤖 Gemini API configured and ready`);
    } else {
      console.log(`⚠️  No Gemini API key found - using baseline model only`);
      console.log(`   Add GEMINI_API_KEY to your .env file to enable AI predictions`);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  return server;
};

startServer(PORT);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
