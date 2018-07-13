const express = require('express');
const auth = express.Router();

// YOUR API ROUTES HERE



// SAMPLE ROUTE
auth.use('/users', (req, res) => {
    res.json({ success: true });
});

module.exports = auth;
