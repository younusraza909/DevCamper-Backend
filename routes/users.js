const express = require('express')
const { getUser,
    getUsers,
    createUser,
    deleteUser,
    updateUser } = require('../controller/user')
const { protect, authRoles } = require('../middleware/auth')
const advancedResults = require('../middleware/advancedResult')
const User = require("../models/User")
const router = express.Router()

// All routes uses same middleware so we can define as
router.use(protect);
router.use(authRoles('admin'))

router.route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser)
router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)




module.exports = router