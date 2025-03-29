const express = require('express');
const authRoute = require('./auth');
const customerRoute = require('./customer');
const orderRoute = require('./order');
const transactionRoute = require('./transaction');
const dashboardRoute = require('./dashboard');

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
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;