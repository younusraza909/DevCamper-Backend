const ErrorResponse = require('../utils/errorResponse')

const ErrorHandler = (err, req, res, next) => {
    //Consoling Error For Development
    console.log(err.stack);

    let error = { ...err }
    error.message = err.message



    // Error Handling For Bad Object Id Mongoose
    if (err.name === 'CastError') {
        const message = `Resource not found`
        error = new ErrorResponse(message, 404)
    }

    // Mongoose Duplicate Key Error
    // Code 11000 is for duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered`
        error = new ErrorResponse(message, 400)
    }

    // validation errror For Required Field
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    })
}

module.exports = ErrorHandler