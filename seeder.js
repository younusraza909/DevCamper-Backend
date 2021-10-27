const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
//Load env vars
dotenv.config({ path: './config/config.env' })

//Load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

//Connect to DB
mongoose.connect(process.env.MONGO_URI)


//Read JSON File
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`))

//Import Data Into Db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        console.log('Data Imported ....');
        process.exit()
    } catch (error) {
        console.log(error);
    }
}

//Delete Data 
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()

        console.log('Data Destroyed ....');
        process.exit()
    } catch (error) {
        console.log(error);
    }
}


if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}