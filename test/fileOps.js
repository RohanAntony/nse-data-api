let fileSetup = require('../utils/File/setup.js')
let fileOps = require('../utils/File/ops.js')
let assert = require('assert');
let fs = require('fs')
let path = require('path')

describe('FileOps', function(){

  describe('createDirIfNotExist', function(){
    let directory = path.join(__dirname, '../TempDir')
    it('should create new directory in root directory if not exists', function(){
      fileSetup.createDirIfNotExist(directory)
      assert.equal(fs.existsSync(directory), true)
    })
    after(function() {
      fs.rmdirSync(directory)
    })
  })

  describe('setupDirectories', function(){
    it('should setup the root directories', function(){
      fileSetup.setupDirectories()
      let status =(
        fs.existsSync(fileSetup.rootDir) &&
        fs.existsSync(fileSetup.sourceDir) &&
        fs.existsSync(fileSetup.destinationDir)
      )
      assert.equal(status, true)
    })
  })

})
