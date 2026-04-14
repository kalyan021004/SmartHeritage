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

describe('POST /api/tour/narrate', () => {
  test('requires site_name and hotspot_name', async () => {
    const res = await request(app).post('/api/tour/narrate').send({});
    expect([400, 500]).toContain(res.statusCode);
  });
});