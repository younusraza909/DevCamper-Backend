const Bootcamp = require('../models/Bootcamp')


// @desc     Get All Bootcamps
// @Route    Get:/api/v1/bootcamps
// @Access   Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps

        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }

}



// @desc     Get a Bootcamp
// @Route    Get:/api/v1/bootcamps/:id
// @Access   Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            return res.status(400).json({
                success: false
            })
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        })
    }
    catch (error) {
        res.status(400).json({
            success: false
        })
    }

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
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
            })
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        })

    } catch (error) {
        res.status(400).json({
            success: false,
        })
    }

}


// @desc     Delete a  Bootcamp
// @Route    DELETE:/api/v1/bootcamps/:id
// @Access   Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
            })
        }
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        res.status(400).json({
            success: false,
        })
    }
}