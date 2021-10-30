const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
// Async Handler 
const asyncHandler = require('../middleware/async')

// @desc     Get All Courses
// @Route    Get:/api/v1/courses
// @Route    Get:/api/v1/bootcamps/:bootcampId/courses
// @Access   Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId })
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        // query = Course.find().populate('bootcamp') //will populate bootcamp with all fields 
        // query = Course.find().populate( { path: 'bootcamp', select: 'name description' }) // selected fields populate with bootcamp
        res.status(200).json(res.advancedResults)

    }


})

// @desc     Get a single Course
// @Route    Get:/api/v1/courses/:id
// @Access   Public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({ path: 'bootcamp', select: 'name description' })
    if (!course) {
        return next(
            new ErrorResponse(`Course not found with this Id ${req.params.id}`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: course
    })
})



// @desc     Add a single Course
// @Route    POST:/api/v1/bootcamps/:bootcampId/courses
// @Access   Pirvate

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with this Id ${req.params.bootcampId}`, 404)
        )
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to add this course for this bootcamp`, 404)
        )
    }


    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        data: course
    })
})

// @desc     Update a single Course
// @Route    PUT:/api/v1/courses/:id
// @Access   Pirvate

exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id)
    if (!course) {
        return next(
            new ErrorResponse(`Bootcamp not found with this Id ${req.params.id}`, 404)
        )
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update this course`, 404)
        )
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: course
    })
})


// @desc     Delete a  Course
// @Route    DELETE:/api/v1/courses/:id
// @Access   Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    //we can use findbyIdandDelete but it will not provoke pre remove middleware of mongoose
    //so we will find document and will use remove method on it
    const course = await Course.findById(req.params.id)
    if (!course) {
        return next(
            new ErrorResponse(`Bootcamp not found with this Id ${req.params.id}`, 404)
        )
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to Delete this course`, 404)
        )
    }

    await course.remove()
    res.status(200).json({
        success: true,
        data: {}
    })

})
