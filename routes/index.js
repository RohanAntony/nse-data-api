var express = require('express');
var utils = require('../utils/utils.js')
var helper = require('../utils/helper.js')
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

router.get('/:date', function(req, res, next){
  helper.getDataForDate(req.params.date, function(data){
    let response = ''
    if(data)
      response = 'Extracted ' + data.length + ' for the date ' + req.params.date;
    else {
      response = 'Not a valid date'
    }
    res.json(data)
  })
})

module.exports = router;
