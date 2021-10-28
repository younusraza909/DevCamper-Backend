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

// There are two types of mongoose method
//Static Method Called on Whole Model itself
//Normal Method are called on documents of that model

CourseSchema.statics.getAverageCost = async function (bootcampId) {

    console.log('Calculating Average Cost')
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: (Math.ceil(obj[0].averageCost) / 10) * 10
        })
    } catch (error) {
        console.log(error)
    }
}


//Call getAverageCost after save
CourseSchema.post('save', function () {
    //in order to call static method we have to call constructor on model 
    this.constructor.getAverageCost(this.bootcamp)
})

//Call getAverageCost Before Remove
CourseSchema.pre('remove', function () {
    this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)