# NOTES from courses

## SECTION 8: Mongoose

### Lec 107: Data Validation - build in validation Mongoose

Ex:

  ```javascript
  // enum
  enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, or difficult.'
  },

  // min/max length
  maxlength: [40, 'A tour name must have less or equal then 40 characters'],
  minlength: [10, 'A tour name must have less or equal then 10 characters'],

  // min/max number
  min: [1, 'Rating must be above 1.0'],
  max: [5, 'Rating must be below 5.0']
  ```

------

### Lec 108

ex: validate `priceDiscount` must less than `price`

------

## SECTION 9: ERROR HANDLING with Express

### Lec 110: ndb - debug tools

Most useful is:

- F9: Step
- F11: Step out (if not interesting in current fn())
- F8: Go ahead and stop!!!

------

### Lec 111 + 112: Overview Error Handling

2 types:

- OPERATIONAL errors:
  - _ex_: invalid path accessed, failed to conntect to server, request timeout, etc.

- PROGRAMMING errors:
  - _ex_: using `await` without `async`, using `req.query` instead of `req.body`, etc.

------

### Lec 113: Global error handling

app.use() with 4 params ---> Express automatically know that is ERROR HANDLING MIDDLEWARE

------

### Lec 114: Better Errors & Refactoring

keyword: stack trace
