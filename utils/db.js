const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/Stock')

// Use this for converting the timestamp to proper date format for storage
const monthToVal = {
  "JAN" : 1,
  "FEB" : 2,
  "MAR" : 3,
  "APR" : 4,
  "MAY" : 5,
  "JUN" : 6,
  "JUL" : 7,
  "AUG" : 8,
  "SEP" : 9,
  "OCT" : 10,
  "NOV" : 11,
  "DEC" : 12
}

const DailyQuoteSchema = new mongoose.Schema({
  SYMBOL: String,
  SERIES: String,
  OPEN: Number,
  HIGH: Number,
  LOW: Number,
  CLOSE: Number,
  LAST: Number,
  PREVCLOSE: Number,
  TOTTRDQTY: Number,
  TOTTRDVAL: Number,
  TIMESTAMP: String,
  TOTALTRADES: Number,
  ISIN: String,
  DATE: {
    DAY: Number,
    MONTH: Number,
    YEAR: Number
  }
})

let updateDate = (quote) => {
  let date = quote['TIMESTAMP'].split('-')
  quote['DATE'] = {
    DAY: date[0],
    MONTH: monthToVal[date[1]],
    YEAR: date[2]
  }
  return quote
}

const DailyQuote = mongoose.model('DailyQuote',DailyQuoteSchema)

const upsertDailyQuote = (quote, cb) => {
  quote = updateDate(quote)
  let DailyQuoteObj = quote//new DailyQuote(quote)
  let findObj = {
    ISIN: quote['ISIN'],
    TIMESTAMP: quote['TIMESTAMP']
  }
  DailyQuote.findOneAndUpdate(
    findObj,
    DailyQuoteObj,
    {
      upsert: true,
      new: true
    },
    (err, doc) => {
      if(err){
        cb(false, 'Error: ' + err)
      }else{
        cb(true, 'Added object with _id: ' + doc['_id'] + ' and version: ' + doc['__v'])
      }
    }
  )
}

module.exports = {
  upsertDailyQuote: upsertDailyQuote
}
