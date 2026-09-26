require('dotenv').config({path: './atlas-credentials.env', override: true })

let MONGODB_URL = process.env.BLOGLIST_MONGODB_URI

module.exports = { MONGODB_URL }