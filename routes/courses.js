const express = require('express')
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controller/courses')
const Course = require('../models/Course')
const { protect, authRoles } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResult')

// We are mergin url for using different resource
const router = express.Router({ mergeParams: true })

router.route('/').get(advancedResults(Course, { path: 'bootcamp', select: 'name description' }), getCourses).post(protect, authRoles('admin', 'publisher'), addCourse)
router.route('/:id').get(getCourse).put(protect, authRoles('admin', 'publisher'), updateCourse).delete(protect, authRoles('admin', 'publisher'), deleteCourse)

module.exports = router