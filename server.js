const mongoose = require('mongoose')
const dotenv = require('dotenv') // npm package for mapping ENV PARAMS (./config.env)

dotenv.config({path: './config.env'})
const app = require('./app')

const DB = process.env.DATABASE.replace('<password>', process.env.DB_PASSWORD)


mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  console.log(con.connections) // ---- show ALL list properties of CONNECTION
  console.log('DB connect successfully!!!')
})


/**
 * Just test code (before REFACTOR using MODELS) Lecture 87
 */
// const testTour = new Tour({
//   name: 'The Test tour',
// })

// testTour.save().then(doc => {
//   console.log(doc)
// }).catch(err => {
//   console.log('ERROR 💥:', err)
// })

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})
