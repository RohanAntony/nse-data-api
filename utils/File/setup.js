let path = require('path')
let fs = require('fs')
let logger = require('../logger.js')

let rootDir = path.join(__dirname, '/tmp')
let sourceDir = rootDir + '/download'
let destinationDir = rootDir + '/data'

let createDirIfNotExist = (dirpath) => {
  logger.debug('Directory Path: ' + dirpath)
  if(!fs.existsSync(dirpath)){
    fs.mkdirSync(dirpath)
    logger.debug('Creating directory as it doesn\'t exist: ' + dirpath)
  }
  logger.debug('Checked and created directory if not exist: ' + dirpath)
  return dirpath
}

let setupDirectories = () => {
  createDirIfNotExist(rootDir)
  createDirIfNotExist(sourceDir)  //folder to store the temp .zip files downloaded
  createDirIfNotExist(destinationDir)  //folder to store the extracted .csv files
}

module.exports = {
  rootDir: rootDir,
  sourceDir: sourceDir,
  destinationDir: destinationDir,
  createDirIfNotExist: createDirIfNotExist,
  setupDirectories: setupDirectories
}
