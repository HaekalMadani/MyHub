const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const spendingRoutes = require('./routes/spendingRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
require('dotenv').config();

const app = express();

app.use(express.json()); // THIS MUST COME FIRST
app.use(cookieParser());
app.use(cors({ origin: 'https://myhub-2025.netlify.app', credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api', spendingRoutes);
app.use('/api/projects', projectRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! (kms)');
});

module.exports = app;