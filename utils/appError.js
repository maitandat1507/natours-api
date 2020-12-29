class AppError extends Error {
  constructor(message, statusCode) {
    super(message) // use `super` to call parent's constructor

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error' // 4xx: fail ; 5xx: error
    this.isOperation = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError