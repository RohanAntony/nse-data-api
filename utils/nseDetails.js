let urljoin = require('url-join')
let logger = require('./logger.js')


let constructFileURL = (day, month, year) => {
  let baseURL = 'https://www.nseindia.com/content/historical/EQUITIES/'
  let filename = constructFilename(day, month, year);
  let fileLocation = year + '/' + month + '/' + filename //format YYYY/MON/cmDDMONYYYYbhav.csv.zip
  let completeURL = urljoin(baseURL, fileLocation)
  logger.info('File URL constructed: ' + completeURL)
  return completeURL
}

let constructFilename = (day, month, year, raw=false) => {
  if(!raw)
    return 'cm' + day + month + year + 'bhav.csv.zip'
  else {
    return 'cm' + day + month + year + 'bhav.csv'
  }
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

module.exports = {
  constructFileURL: constructFileURL,
  constructFilename: constructFilename,
  getDayMonthYear: getDayMonthYear
}
