const express = require('express')

const { getBootcampsInRadius, getBootcamp, getBootcamps, createBootcamp, deleteBootcamp, updateBootcamp, bootcampPhotoUpload } = require('../controller/bootcamps')
const advancedResults = require('../middleware/advancedResult')
const Bootcamp = require('../models/Bootcamp')
const { protect, authRoles } = require('../middleware/auth')

const router = express.Router()

//Include Other resource Router
const courseRouter = require('./courses')
//Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

//
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
// Implementing middleware in route before going for get bootcamp controller
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, authRoles('admin', 'publisher'), createBootcamp)
router.route('/:id').get(getBootcamp).delete(protect, authRoles('admin', 'publisher'), deleteBootcamp).put(protect, authRoles('admin', 'publisher'), updateBootcamp)

router.route('/:id/photo').put(protect, authRoles('admin', 'publisher'), bootcampPhotoUpload)


module.exports = router