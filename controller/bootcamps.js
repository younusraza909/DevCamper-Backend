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
    let queryStr = JSON.stringify(req.query)

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Bootcamp.find(JSON.parse(queryStr))

    const bootcamps = await query
    res.status(200).json({
        success: true,
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

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with this Id ${req.params.id}`, 404)
        )
    }
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