const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const corsOptions = require('./config/cors');
const routes = require('./routes/index');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

module.exports = app;