const express = require('express');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
const recoveryRoutes = require('./routes/recoveryRoutes');

const app = express();
app.use(express.json());

// Register API Routes
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/recoveries', recoveryRoutes);

// Root Health Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Failed Payout Recovery API'
  });
});

module.exports = app;
