class APIFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    // 1A) Filtering
    const queryObj = {
      ...this.queryString
    } // Shallow Copy Object
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])


    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    // let query = Tour.find(JSON.parse(queryStr));

    return this // WHY? to return back to the WHOLE object, that can chain another method in this Object (ex: .filter().sort().aaabbb())
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage') // --- This is standard query using in Mongoose
    } else {
      this.query = this.query.sort('-createdAt')
    }

    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')

      // ex: query.select('name duration price')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v'); // exclude field named '__v' (which created automatically by Mongo)
    }

    return this
  }

  paginate() {
    const page = this.queryString.page * 1 || 1 // convert str to number
    const limit = this.queryString.limit * 1 || 100
    const skip = (page - 1) * limit

    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    // ex: query = query.skip(2).limit(10)
    this.query = this.query.skip(skip).limit(limit)

    return this
  }
}

module.exports = APIFeatures