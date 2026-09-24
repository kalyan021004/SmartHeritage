const request  = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

let app;

beforeAll(async () => {
  const { connectDB } = require('../config/db');
  await connectDB();
  app = require('../server');
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /api/sites/search', () => {
  test('returns empty array for blank query', async () => {
    const res = await request(app).get('/api/sites/search?q=');
    expect(res.statusCode).toBe(200);
    expect(res.body.results).toEqual([]);
  });

  test('returns results for known site', async () => {
    const res = await request(app).get('/api/sites/search?q=Hampi');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  test('health endpoint works', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});