const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // MongoDB Atlas recommended options for Mongoose 6+
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Atlas connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB Atlas disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB Atlas reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 MongoDB Atlas connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    
    // More detailed error information for Atlas connection issues
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed. Please check your username and password.');
    } else if (error.message.includes('network')) {
      console.error('🌐 Network error. Please check your internet connection and Atlas cluster status.');
    } else if (error.message.includes('timeout')) {
      console.error('⏰ Connection timeout. Please check if your IP is whitelisted in Atlas.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 DNS resolution failed. Please check your connection string.');
    }
    
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Check if your IP address is whitelisted in MongoDB Atlas');
    console.error('   2. Verify your username and password are correct');
    console.error('   3. Ensure your cluster is running and accessible');
    console.error('   4. Check your internet connection');
    
    process.exit(1);
  }
};

module.exports = connectDB;