const express = require('express')

const { getBootcamp, getBootcamps, createBootcamp, deleteBootcamp, updateBootcamp } = require('../controller/bootcamps')
const router = express.Router()


router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).delete(deleteBootcamp).put(updateBootcamp)



module.exports = router