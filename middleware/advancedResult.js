const advancedResults = (model, populate) => async (req, res, next) => {
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
    query = model.find(JSON.parse(queryStr))

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
    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit)

    if (populate) {
        query = query.populate(populate)
    }

    //Executing Query
    const results = await query

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



    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }
    next()
}

module.exports = advancedResults