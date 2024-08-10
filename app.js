const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
app.use(cors());
app.use(bodyParser.json());


const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');

app.use('/auth', authRoutes)
app.use('/lead', leadRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the Backend API');
});


//save to database
const port = process.env.PORT || 8000;
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
