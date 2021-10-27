const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDb = require('./config/db')
const ErrorHandler = require("./middleware/error")

//load all config variables
dotenv.config({ path: './config/config.env' })

// Router Files Import Here
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')



// Connecting With MonogoDb Database
connectDb()

const app = express()

// Body Parser
app.use(express.json())

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Mounting Our Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

// Monuting Error Handler Middleware
app.use(ErrorHandler)



const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Your app is running on ${process.env.NODE_ENV} mode and on PORT ${process.env.PORT}`);
})

process.on('unhandledRejection', (err, promise) => {
    console.log(err.message);

    server.close(() => process.exit(1))
})