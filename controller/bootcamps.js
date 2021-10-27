const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')

// Async Handler 
const asyncHandler = require('../middleware/async')


// @desc     Get All Bootcamps
// @Route    Get:/api/v1/bootcamps
// @Access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    // Copy Request Query
    const reqQuery = { ...req.query }
    // Field To Exclude
    const removeFields = ['select', 'sort', "page", 'limit']
    //Loop over remove Fields and delete them from query String
    removeFields.forEach(params => delete reqQuery[params])
    // Creating Query String
    let queryStr = JSON.stringify(reqQuery)
    // Create Operators likr $gt & $gte etx
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

    // Select Field
    if (req.query.select) {
        const fieldsToSelect = req.query.select.split(',').join(' ')
        query.select(fieldsToSelect)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query.sort(sortBy)
    } else {
        query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 100
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit)

    //Executing Query
    const bootcamps = await query

    // pagination
    const pagination = {}
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }


    res.status(200).json({
        success: true,
        pagination,
        count: bootcamps.length,
        data: bootcamps

    })
})



// @desc     Get a Bootcamp
// @Route    Get:/api/v1/bootcamps/:id
// @Access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with this Id ${req.params.id}`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})



// @desc     Create a new Bootcamp
// @Route    POST:/api/v1/bootcamps
// @Access   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    })

})

// @desc     Update a  Bootcamp
// @Route    PUT:/api/v1/bootcamps/:id
// @Access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with this Id ${req.params.id}`, 404)
        )
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    })

}
)

// @desc     Delete a  Bootcamp
// @Route    DELETE:/api/v1/bootcamps/:id
// @Access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    //we can use findbyIdandDelete but it will not provoke pre remove middleware of mongoose
    //so we will find document and will use remove method on it
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with this Id ${req.params.id}`, 404)
        )
    }

    bootcamp.remove()
    res.status(200).json({
        success: true,
        data: {}
    })

})


// @desc     Get a  Bootcamps with in a radius
// @Route    Get:/api/v1/bootcamps/radius/:zipcode/:distance
// @Access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    //Get lat/long from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //Calc Radius using radians
    //Divide Distance by Radius Of Earth
    //Earth Radius = 3963 mi / 6378 KM

    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})