
const masterController = require('../controllers/master.controller');

const express = require('express');
const router = express.Router();

//Revenue ROUTES
router.get('/range-revenue', masterController.getRevenueByDateRange);
router.get('/by-product', masterController.getRevenueByProduct);
router.get('/by-category/:category_name', masterController.getRevenueByCategory);
router.get('/trends/monthly', masterController.revenueTrends);

//TOP ROUTES
router.get('/top-products', masterController.getTopProducts);
router.get('/top/category', masterController.getTopProductsByCategory);
router.get('/top/region', masterController.getTopProductsByRegion);

// Export the router
module.exports = router;