let urljoin = require('url-join')
let logger = require('./logger.js')

let constructFileURL = (day, month, year) => {
  let baseURL = 'https://www.nseindia.com/content/historical/EQUITIES/'
  let filename = constructZipFileName(day, month, year);
  let fileLocation = year + '/' + getMonth(month) + '/' + filename //format YYYY/MON/cmDDMONYYYYbhav.csv.zip
  let completeURL = urljoin(baseURL, fileLocation)
  logger.debug('File URL constructed: ' + completeURL)
  return completeURL
}

let constructZipFileName = (day, month, year, csv=false) => {
  month = getMonth(month)
  day = getValidDay(day)
  if(!csv)
    return 'cm' + day + month + year + 'bhav.csv.zip'
  else {
    return 'cm' + day + month + year + 'bhav.csv'
  }
}

let getMonth = (month) => {
  let monthString = [,"JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  return monthString[month]
}

let getValidDay = (day) => {
  return (day < 10 ? "0" + day : "" + day)
}

module.exports = {
  constructFileURL: constructFileURL,
  constructZipFileName: constructZipFileName
}
