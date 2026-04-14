const mongoose = require('mongoose');
require('dotenv').config();

describe('Database Connection', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('connects to MongoDB successfully', async () => {
    const { connectDB } = require('../config/db');
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1);
  });
});