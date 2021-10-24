const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDb = require('./config/db')

// Router Files Import Here
const bootcamps = require('./routes/bootcamps')

//load all config variables
dotenv.config({ path: './config/config.env' })

// Connecting With MonogoDb Database
connectDb()

const app = express()

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Mounting Our Routes
app.use('/api/v1/bootcamps', bootcamps)



const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log(`Your app is running on ${process.env.NODE_ENV} mode and on PORT ${process.env.PORT}`);
})

process.on('unhandledRejection', (err, promise) => {
    console.log(err.message);

    server.close(() => process.exit(1))
})