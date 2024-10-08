const mongoose = require('mongoose');
const User = require('./models/userModels');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedDatabase = async () => {
    await mongoose.connect(process.env.DATABASE_URL);

    
    const userPassword = '12345678';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);


    const superadmin = new User({
        username: 'admin',
        name: 'admin',
        password: hashedPassword
    });

    const user = new User({
        username: 'user',
        name: 'user',
        password: hashedPassword
    });

    await superadmin.save();
    await user.save();

    console.log('Database seeded!');
    process.exit();
};

seedDatabase().catch(err => console.error(err));
