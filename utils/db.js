const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/Stock')

const DailyQuoteSchema = require('../db/Stock/schema.js')

// Use this for converting the timestamp to proper date format for storage
