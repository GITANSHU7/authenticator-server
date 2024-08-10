const { default: axios } = require('axios');
const User = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// user login
// exports.login = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(400).json({ error: "Invalid password" });

//         }

//         const userDetails = await User.findOne({ username })

//         // Generate JWT token
//         const payload = { userId: user._id };
//         const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.json({
//             message: 'Login successful', data: {
//                 token,
//                 user: userDetails,
//                 success: true
//             }
//         });
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(500).json({ err: err.message, });
//     }
// }

exports.login = async (req, res) => {
    try {
        const { username, password, recaptchaToken } = req.body;

        // Verify reCAPTCHA
        const secretKey = process.env.SITE_KEY; 
        const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

        const recaptchaResponse = await axios.post(recaptchaUrl);
        const recaptchaData = recaptchaResponse.data;

        // if (!recaptchaData.success) {
        //     return res.status(400).json({ message: 'reCAPTCHA verification failed' });
        // }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const userDetails = await User.findOne({ username });

        // Generate JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            data: {
                token,
                user: userDetails,
                success: true
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: err.message });
    }
}

// signup user
exports.signup = async (req, res) => {
    try {
        const { name, password, username } = req.body;

        // Check if all required fields are provided
        if (!username  || !password || !name) {
            return res.status(500).json(
                { error: "All fields (username, password, name) are required" }
            );
        }

        // Check if password length is at least 6 characters
      // Password validation: at least 7 characters, one capital letter, one small letter, one number, and one special character
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(500).json({
            error: "Password must be at least 7 characters long, contain one capital letter, one small letter, one number, and one special character."
        });
    }
    
        const usernameExists = await User.findOne({ username });
        
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            name,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log(savedUser);

        res.status(200).json({ success: true, message: 'User created successfully', data: savedUser, });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

// signout user
exports.signout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ message: 'Signout successful' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

// forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate JWT token
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.json({
            message: 'Reset password link sent.',
            data: {
                token,
                success: true
            }
        });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }

}

