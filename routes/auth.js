const express = require('express')
const { logout, register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controller/auth')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.route('/me').get(protect, getMe)
router.route('/updatedetails').put(protect, updateDetails)
router.route('/updatepassword').put(protect, updatePassword)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:resettoken').put(resetPassword)

module.exports = router