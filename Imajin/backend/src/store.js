const fs = require('fs');
const path = require('path');

const STORE_FILE = path.join(__dirname, '..', 'data', 'store.json');

function ensureStore() {
  const dir = path.dirname(STORE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(STORE_FILE)) {
    const initial = {
      users: [],
      products: [],
      carts: {},
      orders: []
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));
}

function writeStore(obj) {
  ensureStore();
  fs.writeFileSync(STORE_FILE, JSON.stringify(obj, null, 2));
}

module.exports = { readStore, writeStore };
