require("dotenv").config()

const jwt = require("jsonwebtoken");

module.exports = (user) => {
    const payload = {
        _id: user._id,
        username: user.username, 
        exp: Date.now() + +process.env.JWT_EXP * 60 * 1000
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return token
}
