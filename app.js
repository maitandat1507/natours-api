const express = require('express')
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

/***
 * 1/ MIDDLEWARE
 * */
app.use(morgan('dev')) // NPM package `morgan`: middleware for request-response LOGGER

app.use(express.json())

app.use((req, res, next) => {
  console.log('Hello from the Middleware! 😄')
  next()
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})



/***
 * 2/ ROUTE HANDLERS
 * */



/***
 * 3/ ROUTES
 * */
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


/***
 * 4/ START SERVER
 * */
module.exports = app