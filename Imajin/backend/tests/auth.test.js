const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

const STORE = path.join(__dirname, '..', 'data', 'store.json');

beforeEach(() => {
  // reset store
  const initial = { users: [], products: [], carts: {}, orders: [] };
  fs.mkdirSync(path.dirname(STORE), { recursive: true });
  fs.writeFileSync(STORE, JSON.stringify(initial, null, 2));
});

test('register -> login flow', async () => {
  const agent = request(app);
  const reg = await agent.post('/api/auth/register').send({ email: 'a@b.com', password: 'pass123', name: 'A' });
  expect(reg.status).toBe(200);
  expect(reg.body.user.email).toBe('a@b.com');
  const login = await agent.post('/api/auth/login').send({ email: 'a@b.com', password: 'pass123' });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeTruthy();
});

test('register duplicate returns 409', async () => {
  const agent = request(app);
  await agent.post('/api/auth/register').send({ email: 'x@y.com', password: 'p' });
  const r2 = await agent.post('/api/auth/register').send({ email: 'x@y.com', password: 'p' });
  expect(r2.status).toBe(409);
});
