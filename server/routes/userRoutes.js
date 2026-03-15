const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:email', protect, userController.getUserProfile);


router.put('/:email', protect, userController.updateUserProfile);

module.exports = router;
