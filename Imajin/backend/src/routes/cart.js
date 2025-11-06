const express = require('express');
const router = express.Router();
const { authenticateFromHeader, getCart, addToCart, clearCart, checkout } = require('../services');

router.use(authenticateFromHeader);

router.get('/', (req, res) => {
  const cart = getCart(req.user.id);
  res.json(cart);
});

router.post('/add', (req, res) => {
  const { productId, qty } = req.body;
  try {
    const cart = addToCart(req.user.id, productId, qty || 1);
    res.json(cart);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Dummy checkout - accepts partial item list
router.post('/checkout', (req, res) => {
  const { items } = req.body; // items: [{ productId, qty }]
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });
  try {
    const order = checkout(req.user.id, items);
    res.json(order);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
