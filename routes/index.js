var express = require('express');
var fileOps = require('../utils/fileOps.js')
var path = require('path')
var fs = require('fs')

var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Index page')
});

router.use('/:date', function(req, res, next){
  fileOps.setupDirectories()
  next()
})

router.get('/:date', function(req, res, next){
  fileOps.getDataForDate(req.params.date, function(countSuccess, countFail){
    let response = {}
    if(countSuccess)
      response = {
        'Status': 'Success',
        'Success': countSuccess,
        'Failure': countFail,
        'Date': req.params.date
      }
    else {
      response = {
        'Status': 'Failure',
        'Date': req.params.date,
        'Msg': 'Not a valid date'
      }
    }
    res.json(response)
  })
})

module.exports = router;
