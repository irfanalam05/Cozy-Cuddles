const express = require('express')
const { loginAdmin, verifyOTP } = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/login', loginAdmin)
router.post('/verify-otp', verifyOTP)
router.get('/test', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Protected admin route is working',
    admin: req.admin,
  })
})

module.exports = router