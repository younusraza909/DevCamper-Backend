const ErrorResponse = require('../utils/errorResponse')

const ErrorHandler = (err, req, res, next) => {
    //Consoling Error For Development
    console.log(err.stack);

    let error = { ...err }
    error.message = err.message

    // Error Handling For Bad Object Id Mongoose
    if (err.name === 'CastError') {
        const message = `Bootcamp not found with this Id ${error.value}`
        error = new ErrorResponse(message, 404)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error"
    })
}

module.exports = ErrorHandler