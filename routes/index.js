var express = require('express');
var utils = require('../utils/utils.js')
var path = require('path')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:date', function(req, res, next){
  let date = utils.getDayMonthYear(req.params.date)
  let url = utils.constructFileURL(date.day, date.month, date.year);
  let filename = utils.constructFilename(date.day, date.month, date.year);
  let zipFilePath = path.join(__dirname,'../tmp/download/', filename)
  let extractedFilePath = path.join(__dirname, '../tmp/data')
  utils.createDirIfNotExist('../tmp')
  utils.createDirIfNotExist('../tmp/download')  //folder to store the temp .zip files downloaded
  utils.createDirIfNotExist('../tmp/data')  //folder to store the extracted .csv files
  utils.fetchFile(url, zipFilePath, function(){
    utils.unzipFiles(zipFilePath, extractedFilePath, function(file){
      if(!file)
        res.end('Not a valid day')
      res.end('Extracted file to ' + extractedFilePath)
    })
  })
})

module.exports = router;
