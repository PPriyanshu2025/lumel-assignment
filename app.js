// Load environment variables
const dotenv = require('dotenv');
dotenv.config()
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');

// Optional modules (uncomment if used)
// const swaggerUi = require('swagger-ui-express');
// const client = require('prom-client');
// const swaggerDocs = require('./config/swagger.config');

// Routes and config
const apiRoutes = require('./routes/apiGateway');
const apiResponse = require('./response/api.response');
const startServer = require('./config/server.config');
const dbConfig = require('./config/db.config');

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, `env/.env.${process.env.NODE_ENV || 'development'}`),
});

console.log(`Loaded environment from: ${path.resolve(__dirname, `env/.env.${process.env.NODE_ENV || 'development'}`)}`);

// Initialize Express App
const app = express();

//------------------
// Swagger UI (Optional)
//------------------
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//------------------
// DB Config
//------------------
dbConfig();

//------------------
// Middleware Config
//------------------
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

 app.use(cors(corsOptions));
 app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

//------------------
// Routes
//------------------
 app.use('/api/v1', apiRoutes);

//------------------
// 404 Handler
//------------------
// app.all('*', (req, res) => {
//   apiResponse.notFoundResponse(
//     res,
//     `The URL ${req.originalUrl} is not on this server`
//   );
// });

//------------------
// Start Server
//------------------
startServer(app);

