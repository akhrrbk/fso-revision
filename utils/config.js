require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.ammm
console.log(MONGODB_URI)

module.exports = {
    MONGODB_URI,
    PORT
}