const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/egy-store';

async function initDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: 'admin@egy-store.com' });
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'المدير العام',
        email: 'admin@egy-store.com',
        phone: '01000000000',
        password: 'admin123',
        role: 'admin',
        permissions: ['all'],
        approved: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
      console.log('Email: admin@egy-store.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Add some sample data if needed
    // You can add more initialization here

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

initDatabase();