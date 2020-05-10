const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name.'],
    unique: true,
    trim: true 
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration.']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size.']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty.']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price.']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary.']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image.']
  },
  image: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7  // `this` keyword will point to CURRENT Document
})


// type 1. DOCUMENT MIDDLEWARE: runs BEFORE .save() and .create()    (NOT AFFECTED for .insert())
tourSchema.pre('save', function(next) {
  // console.log(this) // `this` - point to currently process document

  this.slug = slugify(this.name, { lower: true })
  next()
})

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...')
//   next()
// })

// tourSchema.post('save', function(doc, next) { // `doc` - the document just saved right before
//   console.log(doc)
//   next()
// })


// type 2. QUERY MIDDLEWARE: run BEFORE .find()
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) { // using Regx ^find   ---> will affect to all query event, not only find(), but also findOne, findBy...
  this.find({ secretTour: {$ne: true } }) // `$ne` - not equal

  this.start = Date.now()
  next()
})

// -------- when use /^find/ Regx above, dont need define the below block code anymore :D just for ref
// tourSchema.pre('findOne', function (next) {
//   this.find({ secretTour: { $ne: true } }); // `$ne` - not equal
//   next();
// });

// .post: run right AFTER .find()
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`) // ex: output "Query took 179 miliseconds"g

  console.log(docs)
  next()
})


const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour
