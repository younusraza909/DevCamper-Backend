const express = require('express')
const { getReviews, getReview } = require('../controller/reviews')
const Review = require('../models/Review')
const { authRoles } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResult')

// We are mergin url for using different resource
const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Review, { path: 'bootcamp', select: 'name description' }), getReviews)

router.route('/:id')
    .get(getReview)
module.exports = router