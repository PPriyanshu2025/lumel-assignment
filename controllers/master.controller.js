/**
 * Revenue controllers
 * This module contains the controllers for handling revenue-related operations.
 * It includes functions for retrieving revenue data, calculating revenue by region,
 */


const Order = require('../models/order.model');




/**
 * Get total revenue within a date range
 * @param {*} req 
 * @param {*} res 
 * Total Revenue Controller 
 * GET /api/revenue/total?start=2024-01-01&end=2024-12-31
 */
exports.getRevenueByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    const result = await Order.aggregate([
      {
        $match: {
          date_of_sale: {
            $gte: new Date(start),
            $lte: new Date(end)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_amount" }
        }
      }
    ]);
    if (result.length === 0) {
      return res.status(404).json({ status: false, message: 'No revenue data found for the specified date range.' });
    }

    res.json({ status:true,message: `Revenue data retrieved successfully for the period ${start} to ${end}`, total_revenue: result[0]?.totalRevenue || 0 });
  } catch (err) {
    res.status(500).json({ status:false, message: 'SEVER ERROR...!', error: err.message });
  }
};

/**
 * Get total revenue by product
 * @param {*} req
 * @param {*} res
 * Total Revenue by Product Controller
 * GET /api/revenue/product
 */

exports.getRevenueByProduct = async (req, res) => {
    try {
       const revenue = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_id",
          product_name: { $first: "$items.product_name" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.unit_price",
                "$items.quantity_sold",
                { $subtract: [1, "$items.discount"] }
              ]
            }
          }
        }
      }
    ]);
        if (revenue.length === 0) {
            return res.status(404).json({ status: false, message: 'No revenue data found for the specified date range.' });
        }
        res.json({ status: true, message: `Revenue by product retrieved successfully`, data: revenue });
    } catch (error) {
        res.status(500).json({ status: false, message: 'SEVER ERROR...!', error: error.message });
    }
}

/**
 * Get total revenue by category
 * @param {*} req
 * @param {*} res
 * Total Revenue by Category Controller
 * GET /api/revenue/category
 */

exports.getRevenueByCategory = async (req, res) => {
  try {
    const { category_name } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ status: false, message: 'Start and end dates are required.' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setUTCHours(23, 59, 59, 999); // include full day

    console.log(`📦 Category: ${category_name} | 🕐 From: ${startDate} To: ${endDate}`);

    const revenue = await Order.aggregate([
      {
        $match: {
          date_of_sale: {
            $gte: startDate,
            $lte: endDate
          },
          order_status: { $ne: "Cancelled" }
        }
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.category": {
            $regex: `^${category_name}$`,
            $options: "i"
          }
        }
      },
      {
        $group: {
          _id: "$items.category",
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.unit_price",
                "$items.quantity_sold",
                { $subtract: [1, "$items.discount"] }
              ]
            }
          }
        }
      }
    ]);

    if (revenue.length === 0) {
      return res.status(404).json({ status: false, message: 'No revenue data found for this category and date range.' });
    }

    res.json({
      status: true,
      message: `Revenue for category "${category_name}" retrieved successfully`,
      data: revenue[0]
    });

  } catch (error) {
    res.status(500).json({ status: false, message: 'SERVER ERROR...!', error: error.message });
  }
};



/**
 * GET total revenue by region
 * @param {*} req
 * @param {*} res
 * Total Revenue by Region Controller
 * GET /api/revenue/region
 */

exports.getRevenueByRegion = async (req, res) => {
    try {
        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: "$region",
                    totalRevenue: { $sum: "$total_amount" }
                }
            }
        ]);
        if (revenue.length === 0) {
            return res.status(404).json({ status: false, message: 'No revenue data found for the specified region.' });
        }

        res.json({ status: true, message: `Revenue by region retrieved successfully`, data: revenue });
    } catch (err) {
        res.status(500).json({ status: false, message: 'SEVER ERROR...!', error: err.message });
    }
};


/**
 * Get revenue trend 
 */

// GET /api/revenue/trends/monthly?year=2024
exports.revenueTrends = async (req, res) => {
  try {
    const { year } = req.query;

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${parseInt(year) + 1}-01-01`);

    const result = await Order.aggregate([
      {
        $match: {
          date_of_sale: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { $month: "$date_of_sale" },
          totalRevenue: { $sum: "$total_amount" }
        }
      },
      {
        $project: {
          month: "$_id",
          totalRevenue: 1,
          _id: 0
        }
      },
      {
        $sort: { month: 1 }
      }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ status: false, message: 'No revenue data found for the specified year.' });
    }
    res.json({ status: true, message: `Revenue trends for ${year} retrieved successfully`, data: result });
  } catch (err) {
    res.status(500).json({ status: false, message: 'SERVER ERROR...!', error: err.message });
  }
};




/**
 * Top N products 
 */

exports.getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_name",
          totalSold: { $sum: "$items.quantity_sold" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.unit_price",
                "$items.quantity_sold",
                { $subtract: [1, "$items.discount"] }
              ]
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit }
    ]);

    res.json({ status: true, data: result });
  } catch (err) {
    res.status(500).json({ status: false, message: 'SERVER ERROR', error: err.message });
  }
};


/**
 * TOP products by category
 * @param {*} req
 * @param {*} res
 * @returns {Object} JSON response with top products by category
 * GET /api/revenue/top-products/category/:category_name?limit=5
 */

exports.getTopProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const limit = parseInt(req.query.limit) || 5;

    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.category": { $regex: `^${category}$`, $options: "i" }
        }
      },
      {
        $group: {
          _id: "$items.product_name",
          totalSold: { $sum: "$items.quantity_sold" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.unit_price",
                "$items.quantity_sold",
                { $subtract: [1, "$items.discount"] }
              ]
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit }
    ]);

    res.json({ status: true, message: `Top products in category '${category}' retrieved successfully`, data: result });
  } catch (err) {
    res.status(500).json({ status: false, message: 'SERVER ERROR', error: err.message });
  }
};



exports.getTopProductsByRegion = async (req, res) => {
  try {
    const { region } = req.query;
    const limit = parseInt(req.query.limit) || 5;

    const result = await Order.aggregate([
      {
        $match: {
          region: { $regex: `^${region}$`, $options: "i" }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_name",
          totalSold: { $sum: "$items.quantity_sold" },
          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.unit_price",
                "$items.quantity_sold",
                { $subtract: [1, "$items.discount"] }
              ]
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit }
    ]);

    res.json({ status: true, data: result });
  } catch (err) {
    res.status(500).json({ status: false, message: 'SERVER ERROR', error: err.message });
  }
};
