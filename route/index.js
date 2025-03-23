const express = require('express');
const authRoute = require('./auth');
const customerRoute = require('./customer');
const orderRoute = require('./order');
const transactionRoute = require('./transaction');

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
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;