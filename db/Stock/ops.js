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
        cb(false, 'Error: ' + err)
      }else{
        logger.info('Added object with _id:' + doc['_id'] + ', version: ' + doc['__v'] + ' for symbol: ' + doc['SYMBOL'] + ' date: ' + doc['TIMESTAMP'])
        cb(true, 'Added object with _id: ' + doc['_id'] + ' and version: ' + doc['__v'])
      }
    }
  )
}

const saveDataInDb = (quotes, cb) => {
  quotes.forEach(function(quote){
    upsertDailyQuote(quote, function(status, message){
      return;
    })
  })
  logger.info('Saved/ing (asyncronously)' + quotes.length + ' entries into DB')
  cb()
}

module.exports = {
  saveDataInDb: saveDataInDb
}
