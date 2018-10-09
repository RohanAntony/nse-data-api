let fs = require('fs')
let path = require('path')
let https = require('https')
let exec = require('child_process').exec;
let csvconverter = require('csvtojson')
let logger = require('./logger.js')
let nseDetails = require('./nseDetails')
let db = require('../db/Stock/ops.js')

let createDirIfNotExist = (dirname='tmp') => {
  let dirPath = path.join( __dirname, dirname)
  logger.debug('DirPath: ' + dirPath)
  if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
    logger.debug('Creating dir as it doesn\'t exist: ' + dirPath)
  }
  logger.debug('Checked directory if not exist: ' + dirPath)
  return dirPath
}

let setupDirectories = () => {
  createDirIfNotExist('../tmp')
  createDirIfNotExist('../tmp/download')  //folder to store the temp .zip files downloaded
  createDirIfNotExist('../tmp/data')  //folder to store the extracted .csv files
}

let fetchFile = (url, writeFile, cb) => {
  let file = fs.createWriteStream(writeFile);
  logger.debug('Write File after extracting Zip: ' + writeFile)
  let request = https.get(url, function(response){
    response.on('data', function(data){
      logger.debug('Fetched data from url: ' + url)
      file.write(data)
    })
    response.on('end', function(){
      logger.info('Fetching data completed from url: ' + url)
      cb()
    })
  })
}

let unzipFiles = (zipFile, output, cb) => {
  let command = 'unzip ' + zipFile + ' -d ' + output
  logger.debug('Unzip command: ' + command)
  exec(command, function(err){
    fs.unlinkSync(zipFile)
    logger.debug('Deleted zipFile: ' + zipFile)
    if(err){createDirIfNotExist
      logger.error(err)
      cb(null)
    }
    logger.info('Unzipping complete for file: ' + zipFile)
    cb(output)
  })
}

let csvToJson = (csvPath, cb) => {
  let jsonData = []
  logger.info('Converting CSV to JSON for files in dir: ' + csvPath)
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
        logger.info('Successfully converted CSV to JSON for file: ' + csvFilePath)
        fs.unlinkSync(csvFilePath)
      })
    })
  })
}

function getDataForDate(d, cb){
  logger.info('Fetching data for Date: ' + d)
  date = d.split('-');
  let url = nseDetails.constructFileURL(date.day, date.month, date.year);
  let filename = nseDetails.constructZipFileName(date.day, date.month, date.year);
  let zipFilePath = path.join(__dirname,'../tmp/download/', filename)
  let extractedFilePath = path.join(__dirname, '../tmp/data')
  fetchFile(url, zipFilePath, function(){
    unzipFiles(zipFilePath, extractedFilePath, function(file){
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
  _createDirIfNotExist: createDirIfNotExist,
  _setupDirectories: setupDirectories,
  _fetchFile: fetchFile,
  _unzipFiles: unzipFiles,
  _csvToJson: csvToJson
}

module.exports = utils
