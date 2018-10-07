const mongoose = require('mongoose')
const DailyQuoteSchema = require('./schema.js')

const DailyQuote = mongoose.model('DailyQuote',DailyQuoteSchema.schema)

const upsertDailyQuote = (quote, cb) => {
  quote = DailyQuoteSchema.updateDate(quote)  //Try moving this to the schema page as a middleware
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
