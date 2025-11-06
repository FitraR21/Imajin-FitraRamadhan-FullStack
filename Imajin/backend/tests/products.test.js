const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

const STORE = path.join(__dirname, '..', 'data', 'store.json');

beforeEach(() => {
  const initial = { users: [], products: [], carts: {}, orders: [] };
  fs.mkdirSync(path.dirname(STORE), { recursive: true });
  fs.writeFileSync(STORE, JSON.stringify(initial, null, 2));
});

test('create and search products', async () => {
  const agent = request(app);
  await agent.post('/api/products/create').send({ title: 'Red Shoes', description: 'Nice', price: 49.99, category: 'shoes' });
  await agent.post('/api/products/create').send({ title: 'Blue Hat', description: 'Cool', price: 19.99, category: 'hats' });
  const all = await agent.get('/api/products');
  expect(all.status).toBe(200);
  expect(all.body.length).toBe(2);
  const search = await agent.get('/api/products').query({ q: 'red' });
  expect(search.body.length).toBe(1);
  const filter = await agent.get('/api/products').query({ category: 'hats' });
  expect(filter.body.length).toBe(1);
});
