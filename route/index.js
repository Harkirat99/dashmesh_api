const express = require('express');
const authRoute = require('./auth');
const customerRoute = require('./customer');
const orderRoute = require('./order');
const transactionRoute = require('./transaction');
const dashboardRoute = require('./dashboard');
const seasonRoute = require('./season');
const supplierRoute = require('./supplier');
const productRoute = require('./product');
const stockRoute = require('./stock');
const expenseRoute = require('./expense');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/customer',
    route: customerRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/transaction',
    route: transactionRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/season',
    route: seasonRoute,
  },
  {
    path: '/supplier',
    route: supplierRoute,
  },
  {
    path: '/product',
    route: productRoute,
  },
  {
    path: '/stock',
    route: stockRoute,
  },
  {
    path: '/expense',
    route: expenseRoute,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;