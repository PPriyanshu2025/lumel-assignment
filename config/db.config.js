const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// __dirname is built-in in CommonJS
const envPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../.env')
    : path.resolve(__dirname, `../env/.env.${process.env.NODE_ENV}`);

dotenv.config({ path: envPath });
console.log(`Loaded environment from: ${envPath}`);

// Database config
const dbConfig = () => {
  const dbUrl = process.env.MONGODB_URL;
      console.log(`Connecting to database at: ${dbUrl}`);

  if (!dbUrl) {
    console.error(' MONGODB_URL is not defined in the environment variables.');
    process.exit(1);
  }

  mongoose.connect(dbUrl);

  mongoose.connection.on('connected', () => {
    console.log(`
---------------------------------------------------------
✅ Database connected
---------------------------------------------------------
    `);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ Database connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log(`
---------------------------------------------------------
⚠️  Database disconnected
---------------------------------------------------------
    `);
  });

  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('✅ Database connection closed due to application termination.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error while closing database connection:', err);
      process.exit(1);
    }
  });
};

module.exports = dbConfig;
