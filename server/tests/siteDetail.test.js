const request  = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

let app;
beforeAll(async () => {
  const { connectDB } = require('../config/db');
  await connectDB();
  app = require('../server');
});
afterAll(async () => { await mongoose.disconnect(); });

describe('GET /api/sites/:slug', () => {
  test('returns site for known slug', async () => {
    const res = await request(app).get('/api/sites/hampi');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBeTruthy();
  });

  test('returns 404 for unknown slug', async () => {
    const res = await request(app).get('/api/sites/nonexistent-place-xyz');
    expect(res.statusCode).toBe(404);
  });
});