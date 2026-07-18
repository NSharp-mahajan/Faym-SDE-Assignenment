require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Starts the server after successfully connecting to the database.
 */
const startServer = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Start the Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`➡️  http://localhost:${PORT}`);
  });
};

// Execute the startup function
startServer();
