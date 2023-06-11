require("dotenv").config()
const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connection established")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb