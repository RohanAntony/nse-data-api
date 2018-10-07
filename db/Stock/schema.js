const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/Stock')

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

// DailyQuoteSchema.pre('findOneAndUpdate', function(doc){
//   // let date = this.model
//   // quoteDate = {
//   //   DAY: date[0],
//   //   MONTH: updateMonthToValue(date[1]),
//   //   YEAR: date[2]
//   // }
//   console.log('Found doc:' + doc)
// })

let updateMonthToValue = (month) => {
  let monthValues = {
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
  return monthValues[month];
}

//Try converting this function to a middleware if possible
let updateDate = (quote) => {
  let date = quote['TIMESTAMP'].split('-')
  quoteDate = {
    DAY: date[0],
    MONTH: updateMonthToValue(date[1]),
    YEAR: date[2]
  }
  quote['DATE'] = quoteDate
  return quote
}

module.exports = {
  schema: DailyQuoteSchema,
  updateDate: updateDate
}
