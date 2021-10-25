const ErrorHandler = (err, req, res, next) => {
    //Consoling Error For Development
    console.log(err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Server Error"
    })
}

module.exports = ErrorHandler