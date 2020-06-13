module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next) // this line of code is ALL MAGIC happened
  }
}