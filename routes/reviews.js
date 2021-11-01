const express = require('express')
const { getReviews, getReview, addReview } = require('../controller/reviews')
const Review = require('../models/Review')
const { authRoles, protect } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResult')

// We are mergin url for using different resource
const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Review, { path: 'bootcamp', select: 'name description' }), getReviews)
    .post(protect, authRoles("user", "admin"), addReview)

router.route('/:id')
    .get(getReview)
module.exports = router