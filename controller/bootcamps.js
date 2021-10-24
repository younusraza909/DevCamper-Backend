const Bootcamp = require('../models/Bootcamp')


// @desc     Get All Bootcamps
// @Route    Get:/api/v1/bootcamps
// @Access   Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show all Bootcamps'
    })
}



// @desc     Get a Bootcamp
// @Route    Get:/api/v1/bootcamps/:id
// @Access   Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Show  Bootcamp ${req.params.id}`
    })
}



// @desc     Create a new Bootcamp
// @Route    POST:/api/v1/bootcamps
// @Access   Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })

    }
}

// @desc     Update a  Bootcamp
// @Route    PUT:/api/v1/bootcamps/:id
// @Access   Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Update bootcampt Number ${req.params.id}`
    })
}


// @desc     Delete a  Bootcamp
// @Route    DELETE:/api/v1/bootcamps/:id
// @Access   Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Delete a Bootcamp ${req.params.id}`
    })
}