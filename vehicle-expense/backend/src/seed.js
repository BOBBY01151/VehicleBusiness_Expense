const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./modules/users/user.model');
const Exporter = require('./modules/exporters/exporter.model');
const config = require('./config/env');

const seedUsers = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({ 
      email: { $in: ['srilanka@example.com', 'exporter@example.com'] } 
    });
    console.log('Cleared existing test users');

    // Create Sri Lankan user
    const sriLankaUser = new User({
      email: 'srilanka@example.com',
      password: 'password123',
      firstName: 'Sri Lanka',
      lastName: 'User',
      role: 'ROLE_LOCAL',
      company: {
        name: 'Sri Lanka Import Company',
        address: {
          street: '123 Main Street',
          city: 'Colombo',
          state: 'Western Province',
          country: 'Sri Lanka',
          postalCode: '00100'
        },
        contact: {
          phone: '+94 11 123 4567',
          email: 'srilanka@example.com'
        }
      },
      isActive: true,
      emailVerified: true
    });

    await sriLankaUser.save();
    console.log('✅ Created Sri Lankan user:', sriLankaUser.email);

    // Create Japan Exporter user
    const exporterUser = new User({
      email: 'exporter@example.com',
      password: 'password123',
      firstName: 'Japan',
      lastName: 'Exporter',
      role: 'ROLE_EXPORTER',
      company: {
        name: 'Tokyo Vehicle Export Co.',
        address: {
          street: '456 Export Street',
          city: 'Tokyo',
          state: 'Tokyo',
          country: 'Japan',
          postalCode: '100-0001'
        },
        contact: {
          phone: '+81 3 1234 5678',
          email: 'exporter@example.com'
        }
      },
      isActive: true,
      emailVerified: true
    });

    await exporterUser.save();
    console.log('✅ Created Japan Exporter user:', exporterUser.email);

    // Create exporter profile
    const exporterProfile = new Exporter({
      userId: exporterUser._id,
      company: {
        name: 'Tokyo Vehicle Export Co.',
        registrationNumber: 'JPN-EXP-001',
        taxId: 'TAX-123456789',
        address: {
          street: '456 Export Street',
          city: 'Tokyo',
          state: 'Tokyo',
          country: 'Japan',
          postalCode: '100-0001'
        },
        contact: {
          phone: '+81 3 1234 5678',
          email: 'exporter@example.com',
          website: 'https://tokyovehicleexport.com'
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
        timezone: 'Asia/Tokyo'
      }
    });

    await exporterProfile.save();
    console.log('✅ Created exporter profile for:', exporterUser.email);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\nTest users:');
    console.log('🇱🇰 Sri Lankan User: srilanka@example.com / password123');
    console.log('🇯🇵 Japan Exporter: exporter@example.com / password123');
    console.log('\nYou can now use the quick login buttons in the frontend!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedUsers();
