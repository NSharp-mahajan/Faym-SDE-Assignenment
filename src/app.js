const express = require('express');

// Import routes
const userRoutes = require('./routes/userRoutes');
const saleRoutes = require('./routes/saleRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');

// Initialize the Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register API Routes
app.use('/api/users', userRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Faym User Payout Management API"
  });
});

module.exports = app;
