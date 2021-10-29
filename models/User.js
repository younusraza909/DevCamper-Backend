const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const UserSchmea = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false //it will not send this field back to us when we call out api
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})


// Encrypts Password Using bcrypt
UserSchmea.pre('save', async function (next) {
    // Generating Salt
    const salt = await bcrypt.genSalt(10)

    this.password = await bcrypt.hash(this.password, salt)
})

//Sign JWT and return
UserSchmea.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Match  User Entered Password to Hashed Password In DB
UserSchmea.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


module.exports = mongoose.model('User', UserSchmea)