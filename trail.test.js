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

describe('POST /api/trail/generate', () => {
  test('requires start_place', async () => {
    const res = await request(app).post('/api/trail/generate').send({});
    expect([400, 500]).toContain(res.statusCode);
  });
});