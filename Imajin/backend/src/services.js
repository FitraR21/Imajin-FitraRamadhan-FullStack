const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readStore, writeStore } = require('./store');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const SALT_ROUNDS = 10;

// Users
async function createUser({ email, password, name }) {
  const store = readStore();
  if (store.users.find(u => u.email === email)) {
    const err = new Error('User exists');
    err.code = 'USER_EXISTS';
    throw err;
  }
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = { id: Date.now().toString(), email, password: hashed, name };
  store.users.push(user);
  writeStore(store);
  return { id: user.id, email: user.email, name: user.name };
}

async function verifyUser(email, password) {
  const store = readStore();
  const u = store.users.find(x => x.email === email);
  if (!u) return null;
  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return null;
  return { id: u.id, email: u.email, name: u.name };
}

function generateToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authenticateFromHeader(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing token' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed token' });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Products
function createProduct({ title, description, price, category }) {
  const store = readStore();
  const p = { id: Date.now().toString(), title, description, price: Number(price), category, createdAt: new Date().toISOString() };
  store.products.push(p);
  writeStore(store);
  return p;
}

function listProducts({ q, category, minPrice, maxPrice, sort }) {
  const store = readStore();
  let items = store.products.slice();
  if (q) {
    const qlc = q.toLowerCase();
    items = items.filter(p => p.title.toLowerCase().includes(qlc) || (p.description || '').toLowerCase().includes(qlc));
  }
  if (category) items = items.filter(p => p.category === category);
  if (minPrice != null) items = items.filter(p => p.price >= Number(minPrice));
  if (maxPrice != null) items = items.filter(p => p.price <= Number(maxPrice));
  if (sort === 'newest') items.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
  if (sort === 'oldest') items.sort((a,b)=> new Date(a.createdAt)-new Date(b.createdAt));
  return items;
}

// Cart (per-user)
function getCart(userId) {
  const store = readStore();
  return store.carts[userId] || [];
}

function addToCart(userId, productId, qty=1) {
  const store = readStore();
  const product = store.products.find(p=>p.id===productId);
  if (!product) throw new Error('Product not found');
  store.carts[userId] = store.carts[userId] || [];
  const entry = store.carts[userId].find(e=>e.productId===productId);
  if (entry) entry.qty += Number(qty);
  else store.carts[userId].push({ productId, qty: Number(qty) });
  writeStore(store);
  return store.carts[userId];
}

function clearCart(userId) {
  const store = readStore();
  store.carts[userId] = [];
  writeStore(store);
}

// Orders
function checkout(userId, items /* [{productId, qty}] */) {
  const store = readStore();
  // Basic conversion into order lines with product snapshot
  const lines = items.map(it => {
    const p = store.products.find(x=>x.id===it.productId);
    if (!p) throw new Error('Product not found during checkout');
    return { productId: p.id, title: p.title, price: p.price, qty: Number(it.qty) };
  });
  const order = { id: Date.now().toString(), userId, lines, total: lines.reduce((s,l)=>s+l.price*l.qty,0), createdAt: new Date().toISOString() };
  store.orders.push(order);
  // remove items from cart
  store.carts[userId] = (store.carts[userId] || []).filter(c => !items.some(it => it.productId === c.productId));
  writeStore(store);
  return order;
}

function listOrders(userId) {
  const store = readStore();
  return store.orders.filter(o => o.userId === userId);
}

module.exports = {
  createUser, verifyUser, generateToken, authenticateFromHeader,
  createProduct, listProducts,
  getCart, addToCart, clearCart,
  checkout, listOrders
};
