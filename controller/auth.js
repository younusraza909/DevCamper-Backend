const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
// Async Handler 
const asyncHandler = require('../middleware/async')


// @desc     Register User
// @Route    Get:/api/v1/auth/register
// @Access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body
    // Create A User
    const user = await User.create({
        name, email, password, role
    })

    // Create Token
    const token = user.getSignedJwtToken();


    res.status(200).json({ success: true, token })
})