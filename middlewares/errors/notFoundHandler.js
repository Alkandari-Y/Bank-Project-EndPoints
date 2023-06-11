module.exports = (req, res, next) => {
 return res.status(404).json({name: "Not Found", message: "Resource not found"})
}