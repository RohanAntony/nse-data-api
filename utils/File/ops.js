let fs = require('fs')
let path = require('path')
let https = require('https')
let exec = require('child_process').exec;
let csvconverter = require('csvtojson')
let logger = require('../logger.js')
let nseDetails = require('../nseDetails')
let db = require('../../db/Stock/ops.js')
let Setup = require('./setup.js')

let rootDir = Setup.rootDir
let sourceDir = Setup.sourceDir
let destinationDir = Setup.destinationDir
let setupDirectories = Setup.setupDirectories

let createWriteFile = (options) => {
  let url = options.url,
      writeFilePath = options.writeFilePath,
      writeFileName = options.writeFile
  if(!url || !writeFilePath || !writeFileName){
    logger.debug('Missing required options in functions fetchFile:')
    return false;
  }
  let writeFile = path.join(writeFilePath, writeFileName);
  let fileStream = fs.createWriteStream(writeFile);
  logger.debug('Write file created for extracting Zip: ' + writeFile)
}

let fetchFile = (options, cb) => {
  createWriteFile(options)
  let request = https.get(url, function(response){
    response.on('data', function(data){
      logger.debug('Fetched data from url: ' + url)
      file.write(data)
    })
    response.on('end', function(){
      logger.debug('Fetching data completed from url: ' + url)
      cb(writeFile)
    })
  })
}

let unzipFile = (zipFile, output, cb) => {
  let command = 'unzip ' + zipFile + ' -d ' + output
  logger.debug('Unzip command: ' + command)
  exec(command, function(err){
    fs.unlinkSync(zipFile)
    logger.debug('Deleted zipFile: ' + zipFile)
    if(err){createDirIfNotExist
      logger.error(err)
      cb(null)
    }
    logger.debug('Unzipping complete for file: ' + zipFile)
    cb(output)
  })
}

let csvToJson = (csvPath, cb) => {
  let jsonData = []
  logger.debug('Converting CSV to JSON for files in dir: ' + csvPath)
  fs.readdir(csvPath, function(err, files){
    files.forEach(function(file, index){
      let csvFilePath = path.join(csvPath, file)
      logger.debug('Found file: ' + csvFilePath)
      csvconverter().fromFile(csvFilePath).then((jsonArray) => {
        jsonArray.forEach(function(json){
          jsonData.push(json)
        })
        if(index == files.length - 1){
          logger.debug('Processed ' + files.length + ' CSV files')
          cb(jsonData) //run the callback after the last file has been parsed into json array
        }
        logger.debug('Successfully converted CSV to JSON for file: ' + csvFilePath)
        fs.unlinkSync(csvFilePath)
      })
    })
  })
}

function getDataForDate(d, cb){
  logger.debug('Fetching data for Date: ' + d)
  date = d.split('-');
  let url = nseDetails.constructFileURL(date.day, date.month, date.year);
  let filename = nseDetails.constructZipFileName(date.day, date.month, date.year);
  let zipFilePath = path.join(__dirname,'../tmp/download/', filename)
  let extractedFilePath = path.join(__dirname, '../tmp/data')
  fetchFile(url, zipFilePath, function(){
    unzipFile(zipFilePath, extractedFilePath, function(file){
      if(!file){
        cb(null)
      }else{
        csvToJson(extractedFilePath, function(quotes){
          db.saveDataInDb(quotes, (success, fail) => {
            cb(success, fail)
          })
        })
      }
    })
  })
}


let utils = {
  setupDirectories: setupDirectories,
  getDataForDate: getDataForDate,
  test: {
    fetchFile: fetchFile,
    unzipFile: unzipFile,
    csvToJson: csvToJson
  }
}

module.exports = utils
