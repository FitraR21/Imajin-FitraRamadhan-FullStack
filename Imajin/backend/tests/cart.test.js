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

async function registerAndLogin(agent, email='u@x.com'){
  await agent.post('/api/auth/register').send({ email, password: 'p' });
  const r = await agent.post('/api/auth/login').send({ email, password: 'p' });
  return r.body.token;
}

test('add to cart and checkout', async () => {
  const agent = request(app);
  // create products
  const p1 = await agent.post('/api/products/create').send({ title: 'P1', price: 10, category: 'c' });
  const p2 = await agent.post('/api/products/create').send({ title: 'P2', price: 5, category: 'c' });
  const token = await registerAndLogin(agent);
  // add to cart
  const add1 = await agent.post('/api/cart/add').set('Authorization', 'Bearer '+token).send({ productId: p1.body.id, qty: 2 });
  expect(add1.status).toBe(200);
  const cart = await agent.get('/api/cart').set('Authorization', 'Bearer '+token);
  expect(cart.body.length).toBe(1);
  // checkout partial (only one product)
  const order = await agent.post('/api/cart/checkout').set('Authorization', 'Bearer '+token).send({ items: [{ productId: p1.body.id, qty: 1 }] });
  expect(order.status).toBe(200);
  expect(order.body.total).toBeGreaterThan(0);
  // order history
  const orders = await agent.get('/api/orders').set('Authorization', 'Bearer '+token);
  expect(orders.body.length).toBe(1);
});
