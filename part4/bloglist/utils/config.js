require('dotenv').config({path: './atlas-credentials.env', override: true })

let MONGODB_URL = process.env.MONGODB_URL

module.exports = { MONGODB_URL }