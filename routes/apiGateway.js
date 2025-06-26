/**
 * API Gateway Route
 * This route serves as the entry point for all API requests.
 */

const express = require('express');
const router = express.Router();

// Import all API routes
//const customerRoutes = require('./customerRoutes');
//const productRoutes = require('./productRoutes');
//const orderRoutes = require('./orderRoutes');

 const masterRoutes = require('./master.routes');
 

router.use('/revenue', masterRoutes);
router.use('/products',masterRoutes)


// Export the router
module.exports = router;