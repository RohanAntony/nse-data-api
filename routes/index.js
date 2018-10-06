var express = require('express');
var utils = require('../utils/utils.js')
var path = require('path')
var fs = require('fs')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Index page')
});

router.use('/:date', function(req, res, next){
  utils.createDirIfNotExist('../tmp')
  utils.createDirIfNotExist('../tmp/download')  //folder to store the temp .zip files downloaded
  utils.createDirIfNotExist('../tmp/data')  //folder to store the extracted .csv files
  next()
})

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
        utils.csvToJson(extractedFilePath, function(obj){
          cb(obj)
        })
      }
    })
  })
}

router.get('/:date', function(req, res, next){
  getDataForDate(req.params.date, function(data){
    let response = ''
    if(data)
      response = 'Extracted ' + data.length + ' for the date ' + req.params.date;
    else {
      response = 'Not a valid date'
    }
    res.end(response)
  })
})

module.exports = router;
