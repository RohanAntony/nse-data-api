let fs = require('fs')
let path = require('path')
let urljoin = require('url-join')
let https = require('https')
let exec = require('child_process').exec;
let unzip = require('zlib').createUnzip()

let createDirIfNotExist = (dirname='tmp') => {
  let dirPath = path.join( __dirname, dirname)
  if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
  }
  console.log(dirPath)
  return dirPath
}

let unzipFiles = (zipFile, output, cb) => {
  // const outFile = path.join('tmp/data', rawFileName)
  // const inp = fs.createReadStream(zipFile);
  // const out = fs.createWriteStream(outFile);
  // inp.pipe(unzip).pipe(out);
  let command = 'unzip ' + zipFile + ' -d ' + output
  console.log(command)
  exec(command, function(err){
    fs.unlinkSync(zipFile)
    if(err){
      console.log(err)
      cb(null)
    }
    cb(output)
  })
}

let constructFileURL = (day, month, year) => {
  let baseURL = 'https://www.nseindia.com/content/historical/EQUITIES/'
  let filename = constructFilename(day, month, year);
  let fileLocation = year + '/' + month + '/' + filename //format YYYY/MON/cmDDMONYYYYbhav.csv.zip
  //console.log(path.join(baseURL, fileLocation))
  return urljoin(baseURL, fileLocation)
}

let constructFilename = (day, month, year, raw=false) => {
  if(!raw)
    return 'cm' + day + month + year + 'bhav.csv.zip'
  else {
    return 'cm' + day + month + year + 'bhav.csv'
  }
}

let fetchFile = (url, writeFile, cb) => {
  console.log(url, writeFile)
  let file = fs.createWriteStream(writeFile);
  let request = https.get(url, function(response){
    response.on('data', function(data){
      console.log(data)
      file.write(data)
    })
    response.on('end', function(){
      cb()
    })
  })
}

let getDayMonthYear = (dateVal) => {
  let month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  let date = new Date(dateVal);
  return {
    day: (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '',
    month: month[date.getMonth()],
    year: (date.getUTCFullYear()) + ''
  }
}

let utils = {
    createDirIfNotExist: createDirIfNotExist,
    constructFileURL: constructFileURL,
    constructFilename: constructFilename,
    fetchFile: fetchFile,
    unzipFiles: unzipFiles,
    getDayMonthYear: getDayMonthYear
}

module.exports = utils
