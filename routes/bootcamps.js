const express = require('express')

const { getBootcampsInRadius, getBootcamp, getBootcamps, createBootcamp, deleteBootcamp, updateBootcamp, bootcampPhotoUpload } = require('../controller/bootcamps')
const advancedResults = require('../middleware/advancedResult')
const Bootcamp = require('../models/Bootcamp')
const { protect } = require('../middleware/auth')

const router = express.Router()

//Include Other resource Router
const courseRouter = require('./courses')
//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

//
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
// Implementing middleware in route before going for get bootcamp controller
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp)
router.route('/:id').get(getBootcamp).delete(protect, deleteBootcamp).put(protect, updateBootcamp)

router.route('/:id/photo').put(protect, bootcampPhotoUpload)


module.exports = router