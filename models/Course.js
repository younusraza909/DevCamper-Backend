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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        if (obj[0]) {
            await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
                averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
            });
        } else {
            await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
                averageCost: undefined,
            });
        }
    } catch (err) {
        console.error(err);
    }
}


//Call getAverageCost after save
CourseSchema.post('save', async function () {
    //in order to call static method we have to call constructor on model 
    await this.constructor.getAverageCost(this.bootcamp)
})

//Call getAverageCost Before Remove
CourseSchema.pre('remove', async function () {
    await this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)