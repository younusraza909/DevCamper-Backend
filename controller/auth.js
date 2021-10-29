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
    sendTokenResponse(user, 200, res)
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

    sendTokenResponse(user, 200, res)
})


//Get token from models,create cokkie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, options).json({ success: true, token })
}