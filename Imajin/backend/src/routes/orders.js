const express = require('express');
const router = express.Router();
const { authenticateFromHeader, listOrders } = require('../services');

router.use(authenticateFromHeader);

router.get('/', (req, res) => {
  const orders = listOrders(req.user.id);
  res.json(orders);
});

module.exports = router;
