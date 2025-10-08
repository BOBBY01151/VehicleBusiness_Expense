const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./src/modules/users/user.model');
const Exporter = require('./src/modules/exporters/exporter.model');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-expense', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB');

    // Clear existing demo users
    await User.deleteMany({ 
      email: { $in: ['srilanka@test.com', 'exporter@test.com', 'admin@test.com'] } 
    });
    console.log('🧹 Cleared existing demo users');

    // Create Sri Lankan User (Local)
    const sriLankaUser = new User({
      email: 'srilanka@test.com',
      password: 'password123',
      firstName: 'Saman',
      lastName: 'Perera',
      role: 'ROLE_LOCAL',
      company: {
        name: 'Lanka Auto Imports',
        address: {
          street: '123 Galle Road',
          city: 'Colombo',
          state: 'Western Province',
          country: 'Sri Lanka',
          postalCode: '00100'
        },
        phone: '+94771234567',
        website: 'https://lankaauto.lk'
      },
      preferences: {
        currency: 'LKR',
        notifications: {
          email: true,
          push: true,
          expenseShared: true,
          expenseUpdated: true
        }
      },
      isActive: true,
      emailVerified: true
    });

    await sriLankaUser.save();
    console.log('✅ Created Sri Lankan user: srilanka@test.com');

    // Create Japan Exporter
    const exporterUser = new User({
      email: 'exporter@test.com',
      password: 'password123',
      firstName: 'Takashi',
      lastName: 'Yamamoto',
      role: 'ROLE_EXPORTER',
      company: {
        name: 'Tokyo Auto Export Co.',
        address: {
          street: '1-2-3 Shibuya',
          city: 'Tokyo',
          state: 'Tokyo',
          country: 'Japan',
          postalCode: '150-0002'
        },
        phone: '+81-3-1234-5678',
        website: 'https://tokyoauto.jp'
      },
      preferences: {
        currency: 'JPY',
        notifications: {
          email: true,
          push: true,
          expenseShared: true,
          expenseUpdated: true
        }
      },
      isActive: true,
      emailVerified: true
    });

    await exporterUser.save();
    console.log('✅ Created Japan Exporter: exporter@test.com');

    // Create Exporter Profile
    const exporterProfile = new Exporter({
      userId: exporterUser._id,
      company: {
        name: 'Tokyo Auto Export Co.',
        registrationNumber: 'JP-2024-001',
        taxId: 'JP123456789',
        address: {
          street: '1-2-3 Shibuya',
          city: 'Tokyo',
          state: 'Tokyo',
          country: 'Japan',
          postalCode: '150-0002'
        },
        contact: {
          phone: '+81-3-1234-5678',
          email: 'exporter@test.com',
          website: 'https://tokyoauto.jp'
        }
      },
      business: {
        type: 'vehicle_exporter',
        specialties: ['cars', 'trucks'],
        yearsInBusiness: 10,
        annualVolume: '101-500'
      },
      verification: {
        isVerified: true,
        verifiedAt: new Date(),
        documents: []
      },
      preferences: {
        currency: 'JPY',
        language: 'ja',
        timezone: 'Asia/Tokyo',
        notifications: {
          newExpenseShared: true,
          expenseUpdated: true,
          paymentReceived: true
        }
      },
      isActive: true
    });

    await exporterProfile.save();
    console.log('✅ Created Exporter Profile');

    // Create Admin User (optional)
    const adminUser = new User({
      email: 'admin@test.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ROLE_ADMIN',
      company: {
        name: 'System Administration'
      },
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();
    console.log('✅ Created Admin user: admin@test.com');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Demo Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🇱🇰 Sri Lankan User:');
    console.log('   Email: srilanka@test.com');
    console.log('   Password: password123');
    console.log('   Role: ROLE_LOCAL (Sri Lankan Importer)');
    console.log('');
    console.log('🇯🇵 Japan Exporter:');
    console.log('   Email: exporter@test.com');
    console.log('   Password: password123');
    console.log('   Role: ROLE_EXPORTER (Japan Exporter)');
    console.log('');
    console.log('👤 Admin:');
    console.log('   Email: admin@test.com');
    console.log('   Password: password123');
    console.log('   Role: ROLE_ADMIN (Administrator)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
