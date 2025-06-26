const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// __dirname is available in CommonJS, no need for fileURLToPath
const envPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../.env')
    : path.resolve(__dirname, `../env/.env.${process.env.NODE_ENV}`);

dotenv.config({ path: envPath });

console.log(`Loaded environment from: ${envPath}`);

// Define server configuration
const serverConfig = {
  port: parseInt(process.env.PORT || '10000', 10),
  host: process.env.HOST || '0.0.0.0',
  baseUrl:
    process.env.BASE_URL || `http://${process.env.HOST}:${process.env.PORT}`,
};

// Server listening function
const startServer = (app) => {
  const { port, host, baseUrl } = serverConfig;

  app.listen(port, host, () => {
    console.log(`
---------------------------------------------------------
 ✅ Server started successfully!
---------------------------------------------------------
 🌍 Running at:        ${baseUrl}
 🚀 Mode:              ${process.env.NODE_ENV || 'development'}
 🕒 Started at:        ${new Date().toLocaleString()}
 📄 API Docs:          ${baseUrl}/api-docs
---------------------------------------------------------
`);
  });
};

module.exports = startServer;
