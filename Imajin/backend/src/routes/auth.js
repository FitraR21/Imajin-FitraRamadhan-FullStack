const express = require('express');
const router = express.Router();
const { createUser, verifyUser, generateToken } = require('../services');

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });
    const user = await createUser({ email, password, name });
    const token = generateToken(user);
    res.json({ user, token });
  } catch (e) {
    if (e.code === 'USER_EXISTS') return res.status(409).json({ error: 'User exists' });
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });
    const user = await verifyUser(email, password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken(user);
    res.json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
