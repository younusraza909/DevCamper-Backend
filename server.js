const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDb = require('./config/db')
const ErrorHandler = require("./middleware/error")
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')

// Security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit')
const cors = require('cors')

//load all config variables
dotenv.config({ path: './config/config.env' })

// Router Files Import Here
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')



// Connecting With MonogoDb Database
connectDb()

const app = express()

// Body Parser
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

// Dev Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// File Upload
app.use(fileupload())

// To prevent no Sql injection query(Security)
app.use(mongoSanitize());
// To add Headers for security & Performance purposes
app.use(helmet())
//To prevent xss cross browser attack
app.use(xss())
// to prevent from HTTP parameter polpulation
app.use(hpp())
//Enable CORS
app.use(cors())
// request limiter
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,//10 minutes
    max: 100
})

app.use(limiter)


// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Mounting Our Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

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