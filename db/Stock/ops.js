const mongoose = require('mongoose')
const DailyQuoteSchema = require('./schema.js')
const logger = require('../../utils/logger.js')

const DailyQuote = mongoose.model('DailyQuote',DailyQuoteSchema.schema)

const upsertDailyQuote = (DailyQuoteData, cb) => {
  quote = DailyQuoteSchema.updateDate(DailyQuoteData)  //Try moving this to the schema page as a middleware
  let findObj = {
    ISIN: quote['ISIN'],
    TIMESTAMP: quote['TIMESTAMP']
  }
  DailyQuote.findOneAndUpdate(
    findObj,
    DailyQuoteData,
    {
      upsert: true,
      new: true
    },
    (err, doc) => {
      if(err){
        logger.error(err)
        cb(false)
      }else{
        logger.info('Added object with _id:' + doc['_id'] + ', version: ' + doc['__v'] + ' for symbol: ' + doc['SYMBOL'] + ' date: ' + doc['TIMESTAMP'])
        cb(true)
      }
    }
  )
}

const saveDataInDb = (quotes, cb) => {
  let success = 0;
  let fail = 0;
  quotes.forEach(function(quote, index){
    upsertDailyQuote(quote, function(status){
      if(status)
        success = success + 1
      else
        fail = fail + 1
      if(index == quotes.length - 1)
        cb(success, fail)
    })
  })
  logger.info('Saved/ing (asyncronously)' + quotes.length + ' entries into DB')
}

module.exports = {
  saveDataInDb: saveDataInDb
}
