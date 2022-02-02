require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.test_ammm : process.env.ammm

module.exports = {
    MONGODB_URI,
    PORT
}