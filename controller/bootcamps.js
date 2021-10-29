const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')
const path = require('path')

// Async Handler 
const asyncHandler = require('../middleware/async')


// @desc     Get All Bootcamps
// @Route    Get:/api/v1/bootcamps
// @Access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
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

    // Add User to body
    req.body.user = req.user.id;

    // Check for published Bootcamps
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

    // If the user is not an admin they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already pulished a bootcamp`, 400))
    }

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

    await bootcamp.remove()
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


// @desc     Upload photo for  Bootcamp
// @Route    PUT:/api/v1/bootcamps/:id/photo
// @Access   Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

    //we can use findbyIdandDelete but it will not provoke pre remove middleware of mongoose
    //so we will find document and will use remove method on it
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with this Id ${req.params.id}`, 404)
        )
    }

    if (!req.files) {
        return next(
            new ErrorResponse(`Please upload a file`, 400)
        )
    }

    const file = req.files.file

    //Make sure that image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`Please upload an image file`, 400)
        )
    }

    // Checking File Size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`File Size should be less than ${process.env.MAX_FILE_UPLOAD}`, 400)
        )
    }

    // Create Custom Filename
    //We use path models to find file name extension
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`


    //MV is a function or method attatched to file object to save image to desired directory
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err)
            return next(
                new ErrorResponse(`Problem with file upload`, 500)
            )
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })

})
