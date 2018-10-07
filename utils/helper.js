var utils = require('./utils.js')
var db = require('./db.js')
var path = require('path')

let saveDataInDb = (quotes, cb) => {
  quotes.forEach(function(quote){
    db.upsertDailyQuote(quote, function(status, message){
      console.log(message)
    })
  })
  console.log('Hello World')
  cb()
}

let getDataForDate = (d, cb) => {
  let date = utils.getDayMonthYear(d)
  let url = utils.constructFileURL(date.day, date.month, date.year);
  let filename = utils.constructFilename(date.day, date.month, date.year);
  let zipFilePath = path.join(__dirname,'../tmp/download/', filename)
  let extractedFilePath = path.join(__dirname, '../tmp/data')
  utils.fetchFile(url, zipFilePath, function(){
    utils.unzipFiles(zipFilePath, extractedFilePath, function(file){
      if(!file){
        cb(null)
      }else{
        utils.csvToJson(extractedFilePath, function(quotes){
          saveDataInDb(quotes, () => {
            cb(quotes)
          })
        })
      }
    })
  })
}

let helper = {
  getDataForDate: getDataForDate
}

module.exports = helper
