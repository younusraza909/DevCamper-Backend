const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
// Async Handler 
const asyncHandler = require('../middleware/async')


// @desc     Register User
// @Route    Get:/api/v1/auth/register
// @Access   Public
exports.register = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true })
})