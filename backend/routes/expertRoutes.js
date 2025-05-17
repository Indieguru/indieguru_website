const express = require('express');
const router = express.Router();
const { expertLogout } = require('../controllers/expertController');
const { verifyExpertToken } = require('../middleware/authMiddleware');

// Add this new route
router.post('/logout', verifyExpertToken, expertLogout);

module.exports = router;