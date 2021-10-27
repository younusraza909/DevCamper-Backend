const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a course title"]
    },
    description: {
        type: String,
        required: [true, "Please add a course Description"]
    },
    weeks: {
        type: String,
        required: [true, "Please add  number of weeks"]
    },
    tuition: {
        type: Number,
        required: [true, "Please add a tution cost"]
    },
    minimumSkill: {
        type: String,
        required: [true, "Please add a minimum Skill"],
        enum: ['beginner', 'intermediate', 'advance']
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})

module.exports = mongoose.model('Course', CourseSchema)