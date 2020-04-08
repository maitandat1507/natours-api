const fs = require('fs')
const Tour = require('./../models/tourModel')

/** Test data */
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`)

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }
  next()
}


exports.getAllTours = async (req, res) => {
  try {

    console.log(req.query)

    // ---- BUILD QUERY
    // 1A) Filtering
    const queryObj = {...req.query}  // Shallow Copy Object
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])


    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)


    // { difficulty: 'easy', duration: { $gte: 5} }
    // { difficulty: 'easy', duration: { gte: '5'} }
    // gte, gt, lte, lt

    let query = Tour.find(JSON.parse(queryStr));


    // 2) Sorting
    if (req.query.sort) {
      let sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy);
      // sort('price ratingsAverage') // --- This is standard query using in Mongoose
    } else {
      query = query.sort('-createdAt')
    }


    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')

      // ex: query.select('name duration price')
      query = query.select(fields)
    } else {
      query = query.select('-__v'); // exclude field named '__v' (which created automatically by Mongo)
    }


    // ---- EXECUTE QUERY
    const tours = await query

    // const query = await Tour.find()
    //   .where('duration',)
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy')


    // ---- SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    // Behind the screen: findOne({_id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    }) 
  }
}

exports.createTour = async (req, res) => {

  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })

  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }

}

exports.updateTour = async (req, res) => {
  try {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}