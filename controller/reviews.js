const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
// Async Handler 
const asyncHandler = require('../middleware/async')

// @desc     Get All Reviews
// @Route    Get:/api/v1/reviews
// @Route    Get:/api/v1/bootcamps/:bootcampId/reviews
// @Access   Public

exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId })
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        // query = Course.find().populate('bootcamp') //will populate bootcamp with all fields 
        // query = Course.find().populate( { path: 'bootcamp', select: 'name description' }) // selected fields populate with bootcamp
        res.status(200).json(res.advancedResults)

    }


})

// @desc     Get Single Review
// @Route    Get:/api/v1/reviews/:id
// @Access   Public

exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({ path: 'bootcamp', select: 'name description' })
    if (!review) {
        return next(
            new ErrorResponse(`Review not found with this Id ${req.params.id}`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: review
    })


})