require('dotenv').config()
const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const reviewRoutes = require('./routes/reviewRoutes')

const app = express()

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// }));
app.use(express.json())
app.use(cookieParser())

app.use('/api/review', reviewRoutes)

mongoose.connect(process.env.DB_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})