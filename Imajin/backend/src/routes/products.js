const express = require('express');
const router = express.Router();
const { createProduct, listProducts } = require('../services');

// Seed helper: create product (admin style) - for dev only
router.post('/create', (req, res) => {
  const p = createProduct(req.body);
  res.json(p);
});

// List/search/filter
router.get('/', (req, res) => {
  const { q, category, minPrice, maxPrice, sort } = req.query;
  const items = listProducts({ q, category, minPrice, maxPrice, sort });
  res.json(items);
});

module.exports = router;
