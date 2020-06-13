const fs = require('fs')
const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')

/** Test data */
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'

  next()
}


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

exports.getAllTours = catchAsync(async (req, res, next) => {
  console.log(req.query)

  // ---- EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const tours = await features.query


  // ---- SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  // Behind the screen: findOne({_id: req.params.id})

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
})

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
})

exports.updateTour = catchAsync(async (req, res, next) => {
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
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: 'success',
    data: null
  })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' }, // _id: mean groupBy `difficulty` (can change to another field), $toUpper is for formatting
        num: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $min: '$price' },
      }
    },
    {
      $sort: { avgPrice: 1 } // 1: ASC | 0: DESC
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  })
})

exports.getMonthyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1 // ex: 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates' // pickup the KEY field to start query (ex: related to `year` input --> choose `startDates`)
    },
    {
      $match: { // like HAVE (MySQL)
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        }
      }
    },
    {
      $group: { // like GROUP BY (MySQL)
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      }
    },
    {
      $addFields: { month: '$_id' } // clone field `_id` to `month`
    },
    {
      $project: {
        _id: 0 // turn off showing '_id' default field
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  })
})