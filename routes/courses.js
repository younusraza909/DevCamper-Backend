const express = require('express')
const { getCourses } = require('../controller/courses')

// We are mergin url for using different resource
const router = express.Router({ mergeParams: true })

router.route('/').get(getCourses)

module.exports = router