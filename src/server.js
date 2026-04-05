const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/password');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);

// Catch-all: serve index.html for any non-API, non-static route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Madinaga server running at http://localhost:${PORT}`);
});

module.exports = app;
