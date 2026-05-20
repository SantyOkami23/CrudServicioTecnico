require('dotenv').config();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = corsOptions;