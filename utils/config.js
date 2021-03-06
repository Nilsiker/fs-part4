/* eslint-disable no-undef */
require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_URI
}

const SECRET = process.env.SECRET

module.exports = {
    MONGODB_URI,
    PORT,
    SECRET
}