const express = require('express')
const morgan = require('morgan')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

/***
 * 1/ MIDDLEWARE
 * */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')) // NPM package `morgan`: middleware for request-response LOGGER
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404)
})

app.use(globalErrorHandler)

/***
 * 4/ START SERVER
 * */
module.exports = app