var express = require('express');
var fileOps = require('../utils/fileOps.js')
var path = require('path')
var fs = require('fs')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Index page')
});

router.use('/:date', function(req, res, next){
  fileOps.setupDirectories()
  next()
})

router.get('/:date', function(req, res, next){
  fileOps.getDataForDate(req.params.date, function(data){
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
