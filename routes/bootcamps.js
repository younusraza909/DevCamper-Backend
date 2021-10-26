const express = require('express')

const { getBootcampsInRadius, getBootcamp, getBootcamps, createBootcamp, deleteBootcamp, updateBootcamp } = require('../controller/bootcamps')
const router = express.Router()

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).delete(deleteBootcamp).put(updateBootcamp)



module.exports = router