const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getSecurityQuestion,
  resetPassword,
  updateProfile,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/security-question', getSecurityQuestion);
router.post('/reset-password', resetPassword);
router.put('/update-profile', protect, updateProfile);
router.get('/me', protect, getMe);

module.exports = router;
