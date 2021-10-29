const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
// Async Handler 
const asyncHandler = require('../middleware/async')


// @desc     Register User
// @Route    POST:/api/v1/auth/register
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


// @desc     Register User
// @Route    POST:/api/v1/auth/login
// @Access   Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    // Validate email and password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400))
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password")
    // + sign make sure it include password bcz we exclude it in model you cam use - sign to exclude if any

    if (!user) {
        return next(new ErrorResponse('Invalid Credentials', 401))
    }

    // Mathcing Password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('Invalid Credentials', 401))
    }

    // Create Token
    const token = user.getSignedJwtToken();


    res.status(200).json({ success: true, token })
})