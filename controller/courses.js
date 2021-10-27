const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
// Async Handler 
const asyncHandler = require('../middleware/async')

// @desc     Get All Courses
// @Route    Get:/api/v1/courses
// @Route    Get:/api/v1/bootcamps/:bootcampId/courses
// @Access   Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        // query = Course.find().populate('bootcamp') //will populate bootcamp with all fields 
        query = Course.find().populate({ path: 'bootcamp', select: 'name description' }) // selected fields populate with bootcamp
    }

    const courses = await query

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})